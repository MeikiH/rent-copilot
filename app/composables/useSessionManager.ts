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
        connectedPlatforms: [],
        createdAt: new Date()
      }
      saveSession()
    }
  }

  const addPlatformConnection = (platformSession: any) => {
    initializeSession()
    
    if (session.value) {
      session.value.connectedPlatforms[platformSession.platformSlug] = platformSession
      session.value.currentPlatform = platformSession.platformSlug
      saveSession()
    }
  }

  const removePlatformConnection = (platformSlug: any) => {
    if (session.value?.connectedPlatforms[platformSlug]) {
      delete session.value.connectedPlatforms[platformSlug]
      
      // If this was the current platform, switch to another or clear
      if (session.value.currentPlatform === platformSlug) {
        const remainingPlatforms = Object.keys(session.value.connectedPlatforms) as any
        session.value.currentPlatform = remainingPlatforms.length > 0 ? remainingPlatforms[0] : undefined
      }
      saveSession()
    }
  }

  const switchPlatform = (platformSlug: any) => {
    if (session.value?.connectedPlatforms[platformSlug]) {
      session.value.currentPlatform = platformSlug
      saveSession()
      return true
    }
    return false
  }

  const getCurrentPlatformSession = () => {
    if (!session.value?.currentPlatform) return null
    return session.value.connectedPlatforms[session.value.currentPlatform] || null as any
  }

  const getPlatformSession = (platformSlug: any) => {
    return session.value?.connectedPlatforms[platformSlug] || null
  }

  const getConnectedPlatforms = () => {
    return Object.keys(session.value?.connectedPlatforms || []) as any
  }

  const isConnectedTo = (platformSlug: any) => {
    return !!session.value?.connectedPlatforms[platformSlug]
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