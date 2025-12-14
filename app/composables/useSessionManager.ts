import type { AppSession, PlatformSession } from '../../types/platforms'

export const useSessionManager = () => {
  const session = ref<AppSession | null>(null)

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  const initializeSession = () => {
    if (!session.value) {
      session.value = {
        sessionId: generateSessionId(),
        connectedPlatforms: {},
        createdAt: new Date()
      }
    }
  }

  const addPlatformConnection = (platformSession: PlatformSession) => {
    initializeSession()
    
    if (session.value) {
      session.value.connectedPlatforms[platformSession.platformSlug] = platformSession
      session.value.currentPlatform = platformSession.platformSlug
    }
  }

  const removePlatformConnection = (platformSlug: string) => {
    if (session.value?.connectedPlatforms[platformSlug]) {
      delete session.value.connectedPlatforms[platformSlug]
      
      // If this was the current platform, switch to another or clear
      if (session.value.currentPlatform === platformSlug) {
        const remainingPlatforms = Object.keys(session.value.connectedPlatforms)
        session.value.currentPlatform = remainingPlatforms.length > 0 ? remainingPlatforms[0] : undefined
      }
    }
  }

  const switchPlatform = (platformSlug: string) => {
    if (session.value?.connectedPlatforms[platformSlug]) {
      session.value.currentPlatform = platformSlug
      return true
    }
    return false
  }

  const getCurrentPlatformSession = (): PlatformSession | null => {
    if (!session.value?.currentPlatform) return null
    return session.value.connectedPlatforms[session.value.currentPlatform] || null
  }

  const getPlatformSession = (platformSlug: string): PlatformSession | null => {
    return session.value?.connectedPlatforms[platformSlug] || null
  }

  const getConnectedPlatforms = (): string[] => {
    return Object.keys(session.value?.connectedPlatforms || {})
  }

  const isConnectedTo = (platformSlug: string): boolean => {
    return !!session.value?.connectedPlatforms[platformSlug]
  }

  const clearSession = () => {
    session.value = null
  }

  const clearPlatformSession = (platformSlug: string) => {
    removePlatformConnection(platformSlug)
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