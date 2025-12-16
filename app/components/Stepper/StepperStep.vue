<template>
  <div v-if="isActive" class="stepper-step transition-all duration-300">
    
    <div class="step-content space-y-6 py-16">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  stepOrder: number
  currentStep: number
}

const props = defineProps<Props>()

const isActive = computed(() => props.currentStep === props.stepOrder)
</script>