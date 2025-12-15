export const useData = () => {
  
  const fetchAllData = async (connection: any) => {
    const platform = connection.platform.slug
    const response = await $fetch(`/api/${platform}/fetchAll`, {
      method: 'POST',
      body: {
        connection: connection
      }
    })
    
    return response
  }

  return {
    fetchAllData
  }
}