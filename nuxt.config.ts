import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    'nuxt-auth-utils'
  ],
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET || 'my-secret-key-change-in-production',
    public: {
      wipimoEnvironment: process.env.NUXT_PUBLIC_WIPIMO_ENVIRONMENT,
    }
  },
});