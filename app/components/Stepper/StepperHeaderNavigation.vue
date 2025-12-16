<template>
  <!-- Steps Navigation -->
  <div class="mb-8">
    <nav class="flex justify-center">
      <ol class="flex items-center space-x-8">
        <li 
          v-for="(step, index) in steps" 
          :key="`step-${index}`"
          class="flex items-center"
        >
          <div 
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all"
            :class="{
              'bg-blue-500 border-blue-500 text-white': index < currentStep,
              'bg-blue-500 border-blue-500 text-white animate-pulse': index === currentStep,
              'border-gray-300 text-gray-500': index > currentStep
            }"
          >
            <Icon v-if="index < currentStep" code="mdi:check" class="text-sm" />
            <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
          </div>
          <div class="ml-4 min-w-0">
            <p 
              class="text-sm font-medium transition-colors"
              :class="{
                'text-blue-600': index <= currentStep,
                'text-gray-500': index > currentStep
              }"
            >
              {{ step.title }}
            </p>
            <p class="text-xs text-gray-500">{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { Step } from './StepperContainer.vue'

interface Props {
  steps: Step[]
  currentStep: number
}

defineProps<Props>()
</script>