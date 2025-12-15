export const useData = () => {
  
  const fetchAllData = async (platform: string) => {
    const response = await $fetch(`/api/${platform}/fetchAll`, {
      method: 'GET'
    })
    
    return response
  }

  return {
    fetchAllData
  }
}