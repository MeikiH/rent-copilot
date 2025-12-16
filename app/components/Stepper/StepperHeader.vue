<template>
  <div>
    <div class="bg-white shadow-sm border-b mb-8">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
          <div class="text-sm text-gray-500">
            Étape {{ currentStep + 1 }} sur {{ totalSteps }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  currentStep: number
  totalSteps: number
}

defineProps<Props>()
</script>