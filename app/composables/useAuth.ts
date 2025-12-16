export const useAuth = () => {
  // Use nuxt-auth-utils for server-side session management
  const { user, session, clear, loggedIn } = useUserSession()
  
  // Custom session manager for client-side platform management
  const sessionManager = useSessionManager()
  
  // Sync server session with client session manager
  const syncSessionManager = () => {
    if (session.value?.platforms && session.value.currentPlatform) {
      const currentPlatform = session.value.currentPlatform as any
      const platformData = (session.value.platforms as any)[currentPlatform]
      
      if (platformData && !sessionManager.isConnectedTo(currentPlatform)) {
        // Convert server session format to client session format
        const platformSession = {
          platformSlug: currentPlatform,
          environment: platformData.environment,
          token: platformData.token,
          userId: (session.value.user as any)?.id || 'user',
          userInfo: session.value.user,
          connectedAt: new Date().toISOString(),
          expiresAt: platformData.expiresAt
        }
        
        sessionManager.addPlatformConnection(platformSession)
      }
    }
  }
  
  // Watch for session changes and sync
  watch(session, () => {
    if (loggedIn.value) {
      syncSessionManager()
    } else {
      sessionManager.clearSession()
    }
  }, { immediate: true, deep: true })
  
  const login = async (platform: any, environment: any, login: any, password: any) => {
    const response = await $fetch(`/api/${platform}/login`, {
      method: 'POST',
      body: {
        environment,
        login,
        password
      }
    })
    
    // Sync after successful login
    if (response.success) {
      await nextTick() // Wait for session to update
      syncSessionManager()
    }
    
    return response as any
  }

  const logout = async () => {
    try {
      // Clear server-side session
      await clear()
    } catch (error) {
      console.warn('Failed to clear server session:', error)
    }
    
    // Clear client-side session
    sessionManager.clearSession()
    
    // Clear browser storage as fallback
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
    }
    
    // Redirect to login
    await navigateTo('/auth/login')
  }
  
  const setUserSession = async (platformData: any) => {
    // Update server-side session
    const userData = {
      id: platformData.userId || 'user',
      platforms: { [platformData.platformSlug]: platformData },
      currentPlatform: platformData.platformSlug,
      connectedAt: new Date().toISOString()
    }
    
    // This will be handled by the login API endpoints
    return userData as any
  }
  
  return {
    // Session state
    user,
    session,
    loggedIn,
    sessionManager,
    
    // Auth actions
    login,
    logout,
    setUserSession,
    syncSessionManager
  }
}