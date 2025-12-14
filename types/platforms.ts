export interface PlatformConfig {
  slug: string
  name: string
  description: string
  authFlow: 'puppeteer' | 'oauth' | 'api_key'
  logo_public_url: string
}

export interface PlatformSession {
  platformSlug: string
  environment: string
  bearerToken: string
  csrfToken: string
  userId: string
  userName: string
  userEmail: string
  connectedAt: Date
  expiresAt?: Date
}

export interface AppSession {
  sessionId: string
  connectedPlatforms: Record<string, PlatformSession>
  currentPlatform?: string
  createdAt: Date
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginRequest {
  platform: string
  environment: string
  credentials: LoginCredentials
}

export interface LoginResponse {
  success: boolean
  bearerToken?: string
  csrfToken?: string
  userId?: string
  userName?: string
  userEmail?: string
  error?: string
}