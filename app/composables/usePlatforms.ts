import platformsConfig from '../../config/platforms.json'

export const usePlatforms = () => {
  const platforms = computed(() => platformsConfig)

  const getPlatformConfig = (slug: string) => {
    return platforms.value[slug] || null
  }

  const getPlatformList = () => {
    return Object.values(platforms.value)
  }

  const getPlatformBySlug = (slug: string) => {
    return platforms.value[slug] || null
  }

  const validatePlatform = (slug: string): boolean => {
    return slug in platforms.value
  }

  const getPlatformLogo = (slug: string, environment?: string): string => {
    const config = getPlatformConfig(slug)
    if (!config) return ''

    // Replace {{environment}} placeholder if present
    if (environment && config.logo_public_url.includes('{{environment}}')) {
      return config.logo_public_url.replace('{{environment}}', environment)
    }

    // Return logo URL as is
    return config.logo_public_url
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