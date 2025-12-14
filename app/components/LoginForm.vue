<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex items-center gap-3 mb-4">
        <LogoEnvironment 
          :platform="platform" 
          :environment="environment" 
          class="w-12 h-12"
        />
        <div>
          <h2 class="card-title">{{ platformConfig?.name }}</h2>
          <p class="text-sm opacity-70">Connexion à {{ environment || 'votre environnement' }}</p>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Environment Input -->
        <FormInput
          v-model="loginForm.environment"
          label="Environnement *"
          placeholder="Nom de l'environnement"
          :error="errors.environment"
          required
        />

        <!-- Username Input -->
        <FormInput
          v-model="loginForm.login"
          label="Identifiant *"
          placeholder="Votre identifiant"
          :error="errors.login"
          required
        />

        <!-- Password Input -->
        <FormInput
          v-model="loginForm.password"
          type="password"
          label="Mot de passe *"
          placeholder="Votre mot de passe"
          :error="errors.password"
          required
        />

        <!-- Error Display -->
        <div v-if="errorMessage" class="alert alert-error">
          <Icon code="heroicons:exclamation-triangle" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Action Buttons -->
        <div class="card-actions justify-between">
          <Button
            type="button" 
            class="btn-ghost"
            @click="$emit('back')"
            :disabled="loading"
            icon="heroicons:arrow-left"
          >
            Retour
          </Button>
          
          <Button
            type="submit" 
            class="btn-primary"
            :disabled="loading"
            :icon="loading ? '' : 'heroicons:arrow-right'"
            icon-position="right"
          >
            <Loading v-if="loading" size="sm" class="mr-2" />
            Se connecter
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  platform: string
  environment?: string
}>()

const emit = defineEmits<{
  loginSuccess: [response: any]
  back: []
}>()

const { getPlatformConfig } = usePlatforms()

const platformConfig = computed(() => getPlatformConfig(props.platform))

const loginForm = ref({
  environment: props.environment || '',
  login: '',
  password: ''
})

const errors = ref<Record<string, string>>({})
const errorMessage = ref('')
const loading = ref(false)

const validateForm = () => {
  errors.value = {}
  
  if (!loginForm.value.environment.trim()) {
    errors.value.environment = 'L\'environnement est requis'
  }
  
  if (!loginForm.value.login.trim()) {
    errors.value.login = 'L\'identifiant est requis'
  }
  
  if (!loginForm.value.password.trim()) {
    errors.value.password = 'Le mot de passe est requis'
  }
  
  return Object.keys(errors.value).length === 0
}

// Generic authentication composable
const { login } = useAuth()

const handleLogin = async () => {
  if (!validateForm()) return
  
  errorMessage.value = ''
  loading.value = true
  
  try {
    console.log('Attempting login...', {
      platform: props.platform,
      environment: loginForm.value.environment,
      login: loginForm.value.login
    })
    
    const response = await login(
      props.platform,
      loginForm.value.environment,
      loginForm.value.login,
      loginForm.value.password
    )
    
    console.log('Login response:', response)
    
    if (response?.success) {
      console.log('Login success, emitting loginSuccess event')
      emit('loginSuccess', response)
    } else {
      console.log('Login failed:', response)
      errorMessage.value = 'Échec de la connexion'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error?.data?.message || 'Une erreur est survenue lors de la connexion'
  } finally {
    loading.value = false
  }
}

// Watch for environment prop changes
watch(() => props.environment, (newEnvironment) => {
  if (newEnvironment) {
    loginForm.value.environment = newEnvironment
  }
})
</script>