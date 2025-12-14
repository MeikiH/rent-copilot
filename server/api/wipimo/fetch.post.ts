import { z } from 'zod'

// Schema for generic fetch request
const fetchSchema = z.object({
  session: z.object({
    platformSlug: z.string(),
    environment: z.string(),
    bearerToken: z.string(),
    csrfToken: z.string(),
    userId: z.string(),
    userName: z.string(),
    userEmail: z.string()
  }),
  endpoint: z.string(),
  payload: z.any().optional()
})

// Entity name to API endpoint mapping for listing
const wipimoPredefinedEndpoints = {
  'Personne': '/breeze/breezeDataService/cliPersonnes?{"expand":["Relations","ActivitePreferee","Activites","Ribs","Telecoms"]}',
  'Bail': '/ger/gerBail/liste',
  'Mandant': '/breeze/breezeDataService/gerMandants?{"expand":["ModGes"]}',
  'Immeuble': '/cli/cliImmeuble/liste',
  'Lot': '/cli/cliLot/liste',
  'LotActif': '/cli/cliLot/liste?Geres=true',
  'ContratLot': '/cli/cliContratLot/liste',
  'Fournisseur': '/cli/cliFour/liste',
  'profile': '/api/Account/Current' // For session validation
}

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event);
    const { session, endpoint, payload } = fetchSchema.parse(body);

    // Get the API endpoint URL
    let apiEndpoint = endpoint;
    
    // If it's a predefined endpoint, get the full path
    if (wipimoPredefinedEndpoints[endpoint as keyof typeof wipimoPredefinedEndpoints]) {
      apiEndpoint = wipimoPredefinedEndpoints[endpoint as keyof typeof wipimoPredefinedEndpoints];
    }

    // Build the full URL
    const domain = `https://${isNaN(Number(session.environment)) ? session.environment : `adhoc-${session.environment}`}.wipimo.fr`;
    let fullUrl: string;

    if (apiEndpoint.startsWith('http')) {
      // Full URL provided
      fullUrl = apiEndpoint;
    } else if (apiEndpoint.startsWith('/api/')) {
      // Wipimo API endpoint
      fullUrl = `https://wipapi.wipimo.fr${apiEndpoint}`;
    } else {
      // Regular Wipimo endpoint
      fullUrl = `${domain}${apiEndpoint}`;
    }

    console.log('Making Wipimo API call to:', fullUrl);

    // Prepare headers
    const headers: HeadersInit = {
      'Authorization': `Bearer ${session.bearerToken}`,
      'Content-Type': 'application/json'
    };

    // Make the API call
    const response = await fetch(fullUrl, {
      method: payload ? 'POST' : 'GET',
      headers,
      body: payload ? JSON.stringify(payload) : undefined
    });

    if (!response.ok) {
      console.error('Wipimo API error:', response.status, response.statusText);
      throw createError({
        statusCode: response.status,
        statusMessage: `Wipimo API error: ${response.statusText}`
      });
    }

    const data = await response.json();
    
    console.log('Wipimo API call successful');

    return {
      success: true,
      data,
      endpoint: apiEndpoint,
      platform: 'wipimo'
    };

  } catch (error: any) {
    console.error('Wipimo fetch error:', error);
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid request data",
        data: { errors: error.errors }
      });
    }
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error during Wipimo API call",
      data: { originalError: error.message }
    });
  }
});