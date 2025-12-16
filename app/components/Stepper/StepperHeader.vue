<template>
  <div>
    <div class="bg-white shadow-sm border-b mb-8">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
            <p v-if="description" class="text-base-content/70">
                {{ description }}
            </p>
          </div>
          <div class="hidden md:block text-sm text-gray-500">
            Étape {{ currentStep + 1 }} sur {{ totalSteps }}
          </div>
          <div class="block md:hidden text-sm text-gray-500">
            {{ currentStep + 1 }} / {{ totalSteps }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  currentStep: number
  totalSteps: number
}

defineProps<Props>()
</script>