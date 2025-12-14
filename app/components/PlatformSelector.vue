<template>
  <div class="card bg-base-100 shadow-xl text-center">

    <div class="card-body">

      <h2 class="card-title mx-auto">Sélectionnez une plateforme</h2>
      <p class="text-sm opacity-70 mb-4">à laquelle vous souhaitez vous connecter</p>
      
      <div class="space-y-4">

        <div 
          v-for="platform in platforms" 
          :key="platform.slug"
          class="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors"
          @click="selectPlatform(platform.slug)"
        >

          <div class="card-body items-center text-center flex">
            <LogoEnvironment 
              :platform="platform.slug"
              class="block w-16 h-16 object-contain mb-2"
            />
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import type { PlatformConfig } from '../../types/platforms'

const emit = defineEmits<{
  platformSelected: [platform: string]
}>()

const { getPlatformList } = usePlatforms()

const platforms = computed<PlatformConfig[]>(() => getPlatformList())

const selectPlatform = (platformSlug: string) => {
  emit('platformSelected', platformSlug)
}
</script>