export const useAuth = () => {
  
  const login = async (platform: string, environment: string, login: string, password: string) => {
    const response = await $fetch(`/api/${platform}/login`, {
      method: 'POST',
      body: {
        environment,
        login,
        password
      }
    })
    
    return response
  }

  return {
    login
  }
}