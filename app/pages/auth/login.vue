
<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">

    <div class="max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4 mx-auto text-center text-primary">Connexion</h2>

      <!-- Step 1: Platform Selection -->
      <PlatformSelector
        v-if="currentStep === 'platform'"
        @platform-selected="handlePlatformSelected"
      />
      
      <!-- Step 2: Login Form -->
      <LoginForm 
        v-else-if="currentStep === 'login'"
        :platform="selectedPlatform!"
        :environment="selectedEnvironment || undefined"
        @login-success="handleLoginSuccess"
        @back="handleBack"
      />
      
      <!-- Loading State -->
      <div v-else-if="currentStep === 'loading'" class="card bg-base-100 shadow-xl">
        <div class="card-body text-center">
          <Loading size="lg" />
          <p>Connexion en cours...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: 'auth'
})

type LoginStep = 'platform' | 'login' | 'loading'

const route = useRoute()
const router = useRouter()

const currentStep = ref<LoginStep>('platform')
const selectedPlatform = ref<string | null>(null)
const selectedEnvironment = ref<string | null>(null)

const handlePlatformSelected = (platform: string) => {
  selectedPlatform.value = platform
  currentStep.value = 'login'
}

const handleBack = () => {
  selectedPlatform.value = null
  selectedEnvironment.value = null
  currentStep.value = 'platform'
}

const handleLoginSuccess = async (response: any) => {
  console.log("Login successful, switching to loading state...")
  currentStep.value = 'loading'
  
  // Refresh the session state on client side like v0.5
  await fetch()
  
  // Small delay to show success state
  await new Promise(resolve => setTimeout(resolve, 500))

  console.log("response", response)
  
  // Use replace navigation to avoid back button issues like v0.5
  const redirectTo = route.query.redirect as string || '/'
  await navigateTo(redirectTo, { replace: true })
}

// Get session composable to refresh client state like v0.5
const { fetch } = useUserSession()

// Show expiry message if redirected due to session expiry
onMounted(() => {
  if (route.query.expired === 'true') {
    // You could show a toast notification here
    console.log('Session expired, please login again')
  }
})
</script>