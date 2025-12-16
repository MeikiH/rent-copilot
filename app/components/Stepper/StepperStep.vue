<template>
  <div v-if="isActive" class="stepper-step transition-all duration-300">
    <div v-if="description" class="mb-6 text-base-content/70">
        {{ description }}
    </div>
    
    <div class="step-content space-y-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  stepIndex: number
  currentStep: number
  stepNumber?: number
}

const props = defineProps<Props>()

const isActive = computed(() => props.currentStep === props.stepIndex)
</script>