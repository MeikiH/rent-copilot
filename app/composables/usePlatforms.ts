import platformsConfig from '../../config/platforms.json'
import type { PlatformConfig } from '../../types/platforms'

export const usePlatforms = () => {
  const platforms = computed(() => platformsConfig as Record<string, PlatformConfig>)

  const getPlatformConfig = (slug: string): PlatformConfig | null => {
    return platforms.value[slug] || null
  }

  const getPlatformList = (): PlatformConfig[] => {
    return Object.values(platforms.value)
  }

  const getPlatformBySlug = (slug: string): PlatformConfig | null => {
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