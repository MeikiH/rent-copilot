<template>
  <div class="container mx-auto p-6">

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <Loading size="lg" />
      <p class="mt-4">Récupération des données...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error">
      <Icon code="heroicons:exclamation-triangle" />
      <span>{{ error }}</span>
      <Button @click="loadData" class="btn-sm">
        Réessayer
      </Button>
    </div>

    <!-- Data Display -->
    <div v-else-if="data" class="space-y-6">
      
      <DataViewerWipimoList
        v-if="currentPlatform === 'wipimo'"
        :persons="data.data.persons" 
        :mandateOwners="data.data.mandateOwners" 
        :properties="data.data.properties" 
        :units="data.data.units" 
        :leases="data.data.leases" 
        :suppliers="data.data.suppliers" 
      />

      <DataViewerX14List
        v-else-if="currentPlatform === 'x14'"
        :persons="data.data.persons" 
        :mandates="data.data.mandates" 
        :properties="data.data.properties" 
        :units="data.data.units" 
        :leases="data.data.leases" 
      />
      
    </div>

    <!-- No Data State -->
    <div v-else class="text-center py-8">
      <Icon code="heroicons:inbox" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p class="text-lg mb-4">Aucune donnée disponible</p>
      <Button @click="loadData" class="btn-primary">
        Charger les données
      </Button>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  title: 'Data Viewer'
})

const { fetchAllData } = useData()
const { session } = useUserSession()

const loading = ref(false)
const error = ref<string | null>(null)
const data = ref<any>(null)

// Get current connection from session
const currentConnection = computed(() => {
  return session.value?.activeConnection || null
})

const currentPlatform = computed(() => {
  return (currentConnection.value as any)?.platform?.slug || null
})

const loadData = async () => {
    console.log('session value:', session.value)
    console.log('currentConnection value:', currentConnection.value)
    
    if (!currentConnection.value) {
        error.value = 'Aucune connexion active'
        return
    }

    loading.value = true
    error.value = null

    try {
        console.log('Loading data for connection:', currentConnection.value)
        
        const response = await fetchAllData(currentConnection.value)
        data.value = response

        console.log('Data loaded successfully:', response)
    } catch (err: any) {
        console.error('Error loading data:', err)
        error.value = err.data?.message || 'Erreur lors du chargement des données'
    } finally {
        loading.value = false
    }
}

// Load data on page mount
onMounted(() => {
  loadData()
})
</script>