<template>
    <img v-if="logoUrl" :src="logoUrl" class="w-20" :alt="`${platformName} logo`"/>
</template>

<script setup lang="ts">
const props = defineProps<{
  platform?: string, // platform slug as 'wipimo' | 'x14'
  environment?: string
}>()

const { getPlatformConfig, getPlatformLogo } = usePlatforms()

const logoUrl = computed(() => {
  if (!props.platform) return ""
  return getPlatformLogo(props.platform, props.environment)
})

const platformName = computed(() => {
  if (!props.platform) return ""
  const config = getPlatformConfig(props.platform)
  return config?.name || props.platform
})
</script>