<template>
  <div class="stepper-navigation mt-8 flex justify-between items-center">
    <Button
      v-if="currentStep > 0"
      @click="$emit('previous')"
      icon="mdi:arrow-left"
      class="bg-gray-200 text-gray-700 hover:bg-gray-300"
    >
      Étape précédente
    </Button>
    
    <div v-else></div>
    
    <div class="text-center">
      <p class="text-sm text-gray-500">
        {{ currentStepTitle }}
      </p>
    </div>
    
    <Button
      v-if="currentStep < totalSteps - 1"
      @click="$emit('next')"
      :disabled="!canProceed"
      icon="mdi:arrow-right"
      iconPosition="right"
      :class="canProceed ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
    >
      Étape suivante
    </Button>
    
    <Button
      v-else
      @click="$emit('finish')"
      :disabled="!canProceed"
      icon="mdi:check"
      :class="canProceed ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
    >
      Terminer
    </Button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number
  totalSteps: number
  canProceed?: boolean
  currentStepTitle?: string
}

withDefaults(defineProps<Props>(), {
  canProceed: true,
  currentStepTitle: ''
})

defineEmits<{
  next: []
  previous: []
  finish: []
}>()
</script>