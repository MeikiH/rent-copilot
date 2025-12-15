export default defineEventHandler(async (event) => {
  try {
    // Get user session
    const session = await getUserSession(event)
    if (!session.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Non authentifié'
      })
    }

    // Get session data for Wipimo
    const wipimoSession = session.platforms?.wipimo
    const token = wipimoSession?.token
    const cliDomain = session.user?.cliDomain

    if (!token || !cliDomain) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Session invalide - token ou domaine manquant'
      })
    }

    // Wipimo endpoints to fetch all data types
    const endpoints = {
      'persons': '/breeze/breezeDataService/cliPersonnes?{"expand":["Relations","ActivitePreferee","Activites","Ribs","Telecoms"]}',
      'leases': '/ger/gerBail/liste',
      'mandateOwners': '/breeze/breezeDataService/gerMandants?{"expand":["ModGes", "Prop"]}',
      'properties': '/cli/cliImmeuble/liste',
      // 'Lots': '/cli/cliLot/liste',
      'units': '/cli/cliLot/liste?Geres=true',
      'suppliers': '/cli/cliFour/liste'
    }

    console.log('Fetching all data for Wipimo...')

    // Fetch all endpoints in parallel
    const results = {}
    
    for (const [entityName, endpoint] of Object.entries(endpoints)) {
      try {
        const apiUrl = `https://wipapi.wipimo.fr/api${endpoint}`
        
        console.log(`Fetching ${entityName} from: ${apiUrl}`)
        
        const response = await $fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }) as any

        // Extract Results array from each response
        results[entityName] = response?.Results || response || []
        
        console.log(`${entityName}: ${results[entityName].length || 0} records`)
        
      } catch (entityError: any) {
        console.error(`Error fetching ${entityName}:`, entityError)
        results[entityName] = []
      }
    }

    console.log('All data fetched successfully')

    return {
      success: true,
      platform: 'wipimo',
      data: results,
      fetchedAt: new Date().toISOString()
    }

  } catch (error: any) {
    console.error('Wipimo data list error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erreur lors de la récupération des données'
    })
  }
})