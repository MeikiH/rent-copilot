export const useSessionManager = () => {
  const session = ref(null) as any

  // Load from localStorage on init
  const loadSession = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rent-copilot-session')
      if (stored) {
        try {
          const parsedSession = JSON.parse(stored)
          // Convert date strings back to Date objects
          if (parsedSession.createdAt) {
            parsedSession.createdAt = new Date(parsedSession.createdAt)
          }
          session.value = parsedSession
        } catch (error) {
          console.warn('Failed to load session from localStorage:', error)
        }
      }
    }
  }

  // Save to localStorage
  const saveSession = () => {
    if (typeof window !== 'undefined' && session.value) {
      localStorage.setItem('rent-copilot-session', JSON.stringify(session.value))
    }
  }

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}` as any
  }

  const initializeSession = () => {
    if (!session.value) {
      session.value = {
        sessionId: generateSessionId(),
        connections: [],
        createdAt: new Date()
      }
      saveSession()
    }
  }

  const addPlatformConnection = (platformSession: any) => {
    initializeSession()
    
    if (session.value) {
      session.value.connections[platformSession.platformSlug] = platformSession
      session.value.activeConnection = platformSession.platformSlug
      saveSession()
    }
  }

  const removePlatformConnection = (platformSlug: any) => {
    if (session.value?.connections[platformSlug]) {
      delete session.value.connections[platformSlug]
      
      // If this was the active connection, switch to another or clear
      if (session.value.activeConnection === platformSlug) {
        const remainingPlatforms = Object.keys(session.value.connections) as any
        session.value.activeConnection = remainingPlatforms.length > 0 ? remainingPlatforms[0] : undefined
      }
      saveSession()
    }
  }

  const switchPlatform = (platformSlug: any) => {
    if (session.value?.connections[platformSlug]) {
      session.value.activeConnection = platformSlug
      saveSession()
      return true
    }
    return false
  }

  const getCurrentPlatformSession = () => {
    if (!session.value?.activeConnection) return null
    return session.value.connections[session.value.activeConnection] || null as any
  }

  const getPlatformSession = (platformSlug: any) => {
    return session.value?.connections[platformSlug] || null
  }

  const getConnectedPlatforms = () => {
    return Object.keys(session.value?.connections || []) as any
  }

  const isConnectedTo = (platformSlug: any) => {
    return !!session.value?.connections[platformSlug]
  }

  const clearSession = () => {
    session.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rent-copilot-session')
    }
  }

  const clearPlatformSession = (platformSlug: any) => {
    removePlatformConnection(platformSlug)
  }

  // Load session on composable creation
  if (!session.value) {
    loadSession()
  }

  return {
    session: readonly(session),
    initializeSession,
    addPlatformConnection,
    removePlatformConnection,
    switchPlatform,
    getCurrentPlatformSession,
    getPlatformSession,
    getConnectedPlatforms,
    isConnectedTo,
    clearSession,
    clearPlatformSession
  }
}