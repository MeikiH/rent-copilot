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
        <h2 class="card-title">Actions rapides</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Button class="btn-outline gap-2">
            <Icon code="heroicons:document-arrow-up" />
            Import données
          </Button>
          <Button class="btn-outline gap-2">
            <Icon code="heroicons:chart-pie" />
            Visualiser
          </Button>
          <Button class="btn-outline gap-2">
            <Icon code="heroicons:arrow-path" />
            Transfert
          </Button>
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
  return Object.keys(session.value?.platforms || {}).length
})

const lastActivity = computed(() => {
  return new Date().toLocaleTimeString('fr-FR')
})
</script>