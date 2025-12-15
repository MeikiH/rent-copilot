<template>
  <div class="menu p-4 w-64 bg-primary text-primary-content from-primary to-secondary h-full">

    <!-- Menu Title -->
    <div class="text-center">
        <LogoEnvironment :platform="activeConnection?.platform?.slug"  :environment="activeConnection?.environment" class="w-12 mx-auto rounded-lg" />
        <div>
            <h1 class="text-lg font-bold">{{ activeConnection?.platform?.name }}</h1>
            <p class="text-xs">{{ activeConnection?.environment }}</p>
            <p class="text-xs opacity-70">{{ activeConnection?.login }}</p>
        </div>
    </div>

    <hr class="my-4" />
    
    <!-- Menu Items -->
    <ul class="space-y-0.5">
      <li v-for="entry in menuEntries" :key="entry.slug">
        <NuxtLink 
          :to="entry.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-content hover:text-primary transition-colors"
          active-class="bg-primary-content text-primary"
        >
          <Icon :code="entry.icon_code" class="w-5 h-5" />
          <span>{{ entry.name }}</span>
        </NuxtLink>
      </li>
      <li>
        <span class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-content hover:text-primary transition-colors" @click="handleLogout" >
          <Icon code="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
          <span>Se déconnecter</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

defineProps({
  menuEntries: {
    type: Array as () => { slug: string; name: string; path: string; icon_code: string }[],
    required: true
  }
})

const { logout, session } = useAuth()
const { getPlatformConfig } = usePlatforms()
const router = useRouter()

// Get current active connection
const activeConnection = computed(() => {
  return session.value?.activeConnection
})

const handleLogout = async () => {
  await logout()
}
</script>