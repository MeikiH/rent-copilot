export default defineEventHandler(async (event) => {
  try {
    // Clear the user session
    await clearUserSession(event)
    
    return {
      success: true,
      message: 'Session cleared successfully'
    }
  } catch (error) {
    console.error('Failed to clear user session:', error)
    
    // Still return success to avoid blocking logout
    return {
      success: true,
      message: 'Session cleanup completed'
    }
  }
})