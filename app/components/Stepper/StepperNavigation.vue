<template>
  <div class="stepper-navigation mt-8 flex justify-between items-center">
    <Button
      v-if="currentStep > 0"
      @click="$emit('previous')"
      icon="mdi:arrow-left"
      class="btn btn-ghost"
    >
      Étape précédente
    </Button>
    
    <div v-else></div>
    
    <div class="text-center">
      <p class="text-sm text-base-content/70">
        {{ currentStepTitle }}
      </p>
    </div>
    
    <Button
      v-if="currentStep < totalSteps - 1"
      @click="$emit('next')"
      :disabled="!canProceed"
      icon="mdi:arrow-right"
      iconPosition="right"
      :class="canProceed ? 'btn btn-primary' : 'btn btn-disabled'"
    >
      Étape suivante
    </Button>
    
    <Button
      v-else
      @click="$emit('finish')"
      :disabled="!canProceed"
      icon="mdi:check"
      :class="canProceed ? 'btn btn-success' : 'btn btn-disabled'"
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