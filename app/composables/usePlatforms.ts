import platformsConfig from '../../config/platforms.json'

export const usePlatforms = () => {
  const platforms = computed(() => platformsConfig) as any

  const getPlatformConfig = (slug: any) => {
    return platforms.value[slug] || null as any
  }

  const getPlatformList = () => {
    return platforms.value as any
  }

  const getPlatformBySlug = (slug: any) => {
    return platforms.value[slug] || null as any
  }

  const validatePlatform = (slug: any) => {
    return slug in platforms.value as any
  }

  const getPlatformLogo = (slug: any, environment?: any) => {
    const config = getPlatformConfig(slug)
    if (!config) return ''

    // Replace {{environment}} placeholder if present
    if (environment && config.logo_public_url.includes('{{environment}}')) {
      return config.logo_public_url.replace('{{environment}}', environment)
    }

    // Return logo URL as is
    return config.logo_public_url as any
  }

  return {
    platforms: readonly(platforms),
    getPlatformConfig,
    getPlatformList,
    getPlatformBySlug,
    validatePlatform,
    getPlatformLogo
  }
}