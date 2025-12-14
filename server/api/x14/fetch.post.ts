import { z } from 'zod'

// Schema for generic fetch request
const fetchSchema = z.object({
  session: z.object({
    platformSlug: z.string(),
    environment: z.string(),
    authenticationToken: z.string(),
    userId: z.string(),
    userName: z.string(),
    userEmail: z.string()
  }),
  endpoint: z.string(),
  payload: z.any().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event);
    const { session, endpoint, payload } = fetchSchema.parse(body);

    // Build the full URL for X14
    const baseUrl = `https://${session.environment}.mygercop.com`;
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    console.log('Making X14 API call to:', fullUrl);

    // Prepare headers with X14 token pattern
    const headers: HeadersInit = {
      'Cookie': `x14=${session.authenticationToken}`,
      'Content-Type': 'application/json'
    };

    // Make the API call
    const response = await fetch(fullUrl, {
      method: payload ? 'POST' : 'GET',
      headers,
      body: payload ? JSON.stringify(payload) : undefined
    });

    if (!response.ok) {
      console.error('X14 API error:', response.status, response.statusText);
      throw createError({
        statusCode: response.status,
        statusMessage: `X14 API error: ${response.statusText}`
      });
    }

    const data = await response.json();
    
    console.log('X14 API call successful');

    return {
      success: true,
      data,
      endpoint,
      platform: 'x14'
    };

  } catch (error: any) {
    console.error('X14 fetch error:', error);
    
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
      statusMessage: "Internal server error during X14 API call",
      data: { originalError: error.message }
    });
  }
});