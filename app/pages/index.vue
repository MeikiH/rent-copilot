<template>
  <div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div class="stat bg-base-100 rounded-lg shadow">
        <div class="stat-figure text-primary">
          <Icon code="heroicons:chart-bar" />
        </div>
        <div class="stat-title">Connexions</div>
        <div class="stat-value text-primary">{{ connectedPlatforms }}</div>
        <div class="stat-desc">Plateformes connectées</div>
      </div>
      
      <div class="stat bg-base-100 rounded-lg shadow">
        <div class="stat-figure text-secondary">
          <Icon code="heroicons:document-check" />
        </div>
        <div class="stat-title">Status</div>
        <div class="stat-value text-secondary">Active</div>
        <div class="stat-desc">Session en cours</div>
      </div>
      
      <div class="stat bg-base-100 rounded-lg shadow">
        <div class="stat-figure">
          <Icon code="heroicons:clock" />
        </div>
        <div class="stat-title">Dernière activité</div>
        <div class="stat-value text-sm">{{ lastActivity }}</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Connexions</h2>
        
        <div v-if="!session?.connections?.length" class="text-center py-8">
          <Icon code="heroicons:plus-circle" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p class="text-lg mb-4">Aucune connexion active</p>
          <Button @click="$router.push('/auth/login')" class="btn-primary">
            Se connecter
          </Button>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="connection in session.connections" 
            :key="connection.id" 
            class="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors"
            :class="{ 'ring-2 ring-primary': isActiveConnection(connection) }"
            @click="switchConnection(connection)"
          >
            <div class="card-body p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <LogoEnvironment 
                    :platform="connection.platform.slug" 
                    :environment="connection.environment" 
                    class="w-12 h-12"
                  />
                  <div>
                    <h3 class="font-bold">{{ connection.platform.name }}</h3>
                    <p class="text-sm opacity-70">{{ connection.environment }}</p>
                    <p class="text-xs opacity-60">{{ connection.login }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div v-if="isActiveConnection(connection)" class="badge badge-primary">Actif</div>
                  <Button size="sm" class="btn-ghost btn-sm" @click.stop="viewData(connection)">
                    <Icon code="heroicons:eye" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  title: 'Dashboard'
})

const { user, session } = useUserSession()

const connectedPlatforms = computed(() => {
  return session.value?.connections?.length || 0
})

const lastActivity = computed(() => {
  return new Date().toLocaleTimeString('fr-FR')
})

const isActiveConnection = (connection: any) => {
  return session.value?.activeConnection?.id === connection.id
}

const switchConnection = async (connection: any) => {
  if (!isActiveConnection(connection)) {
    // Here you would implement switching active connection
    // This might require an API call to update the session
    console.log('Switching to connection:', connection.id)
    // For now, just navigate to data viewer
    await navigateTo('/data-viewer')
  }
}

const viewData = async (connection: any) => {
  // Set as active connection and navigate to data viewer
  await navigateTo('/data-viewer')
}
</script>