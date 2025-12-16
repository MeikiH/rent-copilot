export const useAuth = () => {
  // Use nuxt-auth-utils for server-side session management
  const { user, session, clear, loggedIn } = useUserSession()
  
  const login = async (platform: any, environment: any, login: any, password: any) => {
    const response = await $fetch(`/api/${platform}/login`, {
      method: 'POST',
      body: {
        environment,
        login,
        password
      }
    })
    
    return response as any
  }

  const logout = async () => {
    try {
      // Clear server-side session
      await clear()
    } catch (error) {
      console.warn('Failed to clear server session:', error)
    }
    
    // Clear browser storage as fallback
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
    }
    
    // Redirect to login
    await navigateTo('/auth/login')
  }
  
  // Helper functions for session data access
  const getConnections = () => {
    const connections = session.value?.connections || []
    // Convert to array if it's an object
    if (Array.isArray(connections)) {
      return connections
    }
    return Object.values(connections) as any
  }

  const getActiveConnection = () => {
    return session.value?.activeConnection || null
  }

  const isConnectedTo = (connectionId: any) => {
    const connections = getConnections()
    if (!Array.isArray(connections)) return false
    return connections.some((conn: any) => conn.id === connectionId)
  }

  const switchConnection = async (connection: any) => {
    // Update active connection in server session
    const response = await $fetch('/api/session/switch-connection', {
      method: 'POST',
      body: { connectionId: connection.id }
    })
    return response
  }
  
  return {
    // Session state
    user,
    session,
    loggedIn,
    
    // Auth actions
    login,
    logout,
    
    // Helper functions
    getConnections,
    getActiveConnection,
    isConnectedTo,
    switchConnection
  }
}