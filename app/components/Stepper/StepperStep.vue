<template>
  <div v-if="isActive" class="stepper-step transition-all duration-300">
    <div v-if="description" class="mb-6 text-gray-600">
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
  isActive?: boolean
  stepNumber?: number
}

withDefaults(defineProps<Props>(), {
  isActive: false
})
</script>