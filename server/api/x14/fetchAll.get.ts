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

    // Get session data for X14
    const x14Session = session.platforms?.x14
    const bearerToken = x14Session?.authenticationToken
    const environment = x14Session?.environment

    if (!bearerToken || !environment) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Session invalide - token ou environnement manquant'
        })
    }

    // X14 endpoints to fetch all data types
    const endpoints = {
      'persons': '/individus',
      'leases': '/contrats-location?sortColumn=contrat_location_ref&sortOrder=desc&sqlWhereFilters[0][filterColumn]=x14_contrats_location.statut&sqlWhereFilters[0][filterOperator]=equal&sqlWhereFilters[0][filterValue]=open',
      'mandates': '/mandats-gestion?sortColumn=mandat_gestion_ref&sortOrder=desc&sqlWhereFilters[0][filterColumn]=x14_contrats_mandats_gestion.statut&sqlWhereFilters[0][filterOperator]=equal&sqlWhereFilters[0][filterValue]=open',
      'properties': '/batiments',
      'units': '/lots'
    }

    console.log('Fetching all data for X14...')

    // Fetch all endpoints in parallel
    const results = {}
    
    for (const [entityName, endpoint] of Object.entries(endpoints)) {
      try {
        const apiUrl = `https://${environment}.mygercop.com${endpoint}`
        
        console.log(`Fetching ${entityName} from: ${apiUrl}`)
        
        const response = await $fetch(apiUrl, {
          method: 'GET',
          headers: {
            Cookie: `x14=${bearerToken}`,
            "Content-Type": "application/json",
          }
        }) as any

        // X14 API returns data directly in the response
        results[entityName] = response?.data || response || []
        
        console.log(`${entityName}: ${results[entityName].length || 0} records`)
        
      } catch (entityError: any) {
        console.error(`Error fetching ${entityName}:`, entityError)
        results[entityName] = []
      }
    }

    console.log('All data fetched successfully')

    return {
      success: true,
      platform: 'x14',
      data: results,
      fetchedAt: new Date().toISOString()
    }

  } catch (error: any) {
    console.error('X14 data list error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erreur lors de la récupération des données'
    })
  }
})