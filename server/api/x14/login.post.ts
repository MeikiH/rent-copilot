import { z } from 'zod'

// Schema for X14 login request
const loginSchema = z.object({
  environment: z.string(),
  login: z.string(),
  password: z.string()
})

// X14 response types
type X14AuthStorage = {
  id: string
  nom: string
  login: string
  expiration: number
}

type X14Agence = {
  id: string
  nom: string
  computedName: string
}

type X14LoginResponse = {
  authentication: boolean
  authenticationResult: string
  authenticationToken: string
  data: {
    AuthStorage: X14AuthStorage
    Agence: X14Agence
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event);
    const { environment, login, password } = loginSchema.parse(body);

    // X14 login URL
    const loginUrl = `https://${environment}.mygercop.com/authenticate`;

    console.log('X14 authentication attempt:', { environment, login, loginUrl });

    try {
      // Make direct POST request to X14 API
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login,
          password
        })
      });

      if (!response.ok) {
        throw createError({
          statusCode: response.status,
          statusMessage: `X14 API error: ${response.statusText}`,
        });
      }

      const x14Response = await response.json() as X14LoginResponse;

      console.log('X14 response received:', { 
        authentication: x14Response.authentication,
        authenticationResult: x14Response.authenticationResult 
      });

      // Check if authentication was successful
      if (!x14Response.authentication || !x14Response.authenticationToken) {
        throw createError({
          statusCode: 401,
          statusMessage: x14Response.authenticationResult || "Identifiants X14 invalides",
        });
      }

      const { AuthStorage, Agence } = x14Response.data;

      console.log('X14 authentication successful for user:', AuthStorage.nom);

      // Create user session like v0.5 but for X14
      await setUserSession(event, {
        user: {
          // X14 fields
          id: AuthStorage.id,
          login: AuthStorage.login,
          nom: AuthStorage.nom,
          
          // Normalized fields for consistency with Wipimo
          userName: AuthStorage.nom,
          email: '', // X14 doesn't provide email in auth response
          companyName: Agence.nom
        },
        platforms: {
          x14: {
            environment,
            authenticationToken: x14Response.authenticationToken,
            agenceId: Agence.id,
            agenceName: Agence.nom,
            expiresAt: AuthStorage.expiration * 1000 // Convert to milliseconds
          }
        },
        currentPlatform: 'x14'
      });

      return {
        success: true,
        authenticationToken: x14Response.authenticationToken,
        user: {
          id: AuthStorage.id,
          nom: AuthStorage.nom,
          login: AuthStorage.login
        },
        agence: Agence
      };

    } catch (fetchError: any) {
      console.error('X14 fetch error details:', {
        message: fetchError.message,
        url: loginUrl
      });
      
      // Provide more specific error messages
      let errorMessage = "Erreur pendant l'authentification avec X14";
      
      if (fetchError.message?.includes('fetch failed')) {
        errorMessage = "Impossible de se connecter à X14. Vérifiez le nom de l'environnement.";
      } else if (fetchError.message?.includes('timeout')) {
        errorMessage = "Timeout lors de la connexion à X14. Réessayez.";
      }
      
      throw createError({
        statusCode: 401,
        statusMessage: errorMessage,
        data: { 
          originalError: fetchError.message,
          environment,
          url: loginUrl
        }
      });
    }

  } catch (error: any) {
    console.error('X14 Login API error:', error);
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: "Données invalides",
        data: { errors: error.errors }
      });
    }
    
    if (error.statusCode) {
      throw error;
    }
    
    return {
      success: false,
      error: error.message || "Erreur interne du serveur"
    };
  }
});