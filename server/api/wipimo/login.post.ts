import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { z } from 'zod';

// Schema for login request
const loginSchema = z.object({
  environment: z.string(),
  login: z.string(),
  password: z.string()
})

// Wipimo user type
type WipimoApiUser = {
  Id: number
  UserName: string
  Email: string
  Pseudo: string
  Societe?: string
  cliDomain: string
  Roles: string[]
}

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event);
    const { environment, login, password } = loginSchema.parse(body);

    // Access runtime configuration
    const config = useRuntimeConfig();

    // URLs configuration
    const domain = `https://${isNaN(Number(environment)) ? environment : `adhoc-${environment}`}.wipimo.fr`;
    const urlLogin = `${domain}/Account/Login`;
    const urlCurrentUser = `https://wipapi.wipimo.fr/api/Account/Current`;

    // Check environment restriction if configured
    const configuredEnvironment = config.public.wipimoEnvironment;
    if (configuredEnvironment && environment !== configuredEnvironment) {
      throw createError({
        statusCode: 400,
        statusMessage: `L'Environnement doit être ${configuredEnvironment}.`,
      });
    }

    let browser = null;

    try {
      console.log('Starting Puppeteer authentication for environment:', environment);
      console.log('Login URL:', urlLogin);
      
      const isVercel = process.env.VERCEL_ENV !== undefined;
      console.log('Is Vercel environment:', isVercel);

      if (isVercel) {
        // Use puppeteer-core with @sparticuz/chromium for Vercel
        console.log('Using @sparticuz/chromium for Vercel');
        browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: (chromium as any).defaultViewport || { width: 1280, height: 720 },
          executablePath: await chromium.executablePath(),
          headless: (chromium as any).headless ?? true,
        });
      } else {
        // Use full puppeteer for local development
        console.log('Using local puppeteer installation');
        const puppeteerLocal = (await import("puppeteer")).default;
        browser = await puppeteerLocal.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      }
      
      console.log('Browser launched successfully');
      const page = await browser.newPage();
      
      // Set a reasonable timeout
      page.setDefaultTimeout(30000); // 30 seconds

      console.log('Navigating to login page...');
      await page.goto(urlLogin, { waitUntil: 'networkidle2' });
      
      console.log('Page loaded, waiting for form elements...');
      // Wait for form elements to appear
      await page.waitForSelector('#UserName', { visible: true });
      await page.waitForSelector('#Password', { visible: true });
      await page.waitForSelector('.btn-connex', { visible: true });

      console.log('Form elements found, filling form...');
      // Fill the login form
      await page.type("#UserName", login);
      await page.type("#Password", password);

      console.log('Submitting form...');
      // Submit the form
      await Promise.all([
        page.click(".btn-connex"),
        page.waitForNavigation(),
      ]);

      console.log('Navigation completed, extracting token...');
      // Extract token from localStorage or sessionStorage
      const token = await page.evaluate(() => {
        return (
          localStorage.getItem("accesstoken") ||
          sessionStorage.getItem("accesstoken")
        );
      });

      if (!token) {
        console.log('No bearer token found in localStorage/sessionStorage');
        throw createError({
          statusCode: 401,
          statusMessage: "Identifiants invalides ou erreur d'authentification",
        });
      }

      console.log('Bearer token extracted successfully');
      await browser.close();

      console.log('Fetching user information...');
      // Fetch user information
      const responseUser = await fetch(urlCurrentUser, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!responseUser.ok) {
        throw createError({
          statusCode: 401,
          statusMessage: "Erreur lors de la récupération des données du compte Utilisateur",
        });
      }

      const userInfo = await responseUser.json() as WipimoApiUser;

      console.log('User authenticated successfully:', userInfo);

      // Validate that we have the required fields
      if (!userInfo || !userInfo.cliDomain || !userInfo.Pseudo) {
        throw createError({
          statusCode: 500,
          statusMessage: "Réponse utilisateur invalide de Wipimo",
        });
      }

      // Get existing session and merge connections
      const existingSession = await getUserSession(event)
      const existingConnections = (existingSession?.connections || []) as any[]
      
      // Create computed ID: platformSlug-environment
      const connectionId = `wipimo-${environment}`
      
      // Create connection object with platform metadata
      const connectionObject = {
        id: connectionId,
        platform: {
          slug: 'wipimo',
          name: 'Wipimo',
          description: 'Plateforme de gestion locative Wipimo'
        },
        environment,
        login,
        cliDomain: userInfo.cliDomain,
        token,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      }
      
      // Remove existing connection with same ID if it exists
      const updatedConnections = existingConnections.filter(conn => conn.id !== connectionId)
      
      // Create or update user session with merged connections
      await setUserSession(event, {
        user: {
          id: String(userInfo.Id),
          login: userInfo.Pseudo,
          email: userInfo.Email,
          userName: userInfo.UserName,
          companyName: userInfo.Societe ?? userInfo.cliDomain
        },
        connections: [...updatedConnections, connectionObject],
        activeConnection: connectionObject
      });

      return {
        success: true,
        cliDomain: userInfo.cliDomain,
        token,
        user: userInfo
      };

    } catch (puppeteerError: any) {
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser:', closeError);
        }
      }
      
      console.error('Puppeteer error details:', {
        message: puppeteerError.message,
        name: puppeteerError.name,
        stack: puppeteerError.stack,
        url: urlLogin
      });
      
      // Provide more specific error messages
      let errorMessage = "Erreur pendant l'authentification avec Wipimo";
      
      if (puppeteerError.message?.includes('net::ERR_NAME_NOT_RESOLVED')) {
        errorMessage = "Impossible de se connecter à l'environnement Wipimo. Vérifiez le nom de l'environnement.";
      } else if (puppeteerError.message?.includes('TimeoutError')) {
        errorMessage = "Timeout lors de la connexion à Wipimo. Vérifiez vos identifiants ou réessayez.";
      } else if (puppeteerError.message?.includes('No node found for selector')) {
        errorMessage = "Interface de connexion Wipimo introuvable. Le site pourrait avoir changé.";
      } else if (puppeteerError.message?.includes('Failed to launch')) {
        errorMessage = "Impossible de démarrer le navigateur. Problème de configuration du serveur.";
      }
      
      throw createError({
        statusCode: 401,
        statusMessage: errorMessage,
        data: { 
          originalError: puppeteerError.message,
          environment,
          url: urlLogin
        }
      });
    }

  } catch (error: any) {
    console.error('Login API error:', error);
    
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