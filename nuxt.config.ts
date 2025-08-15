// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/content',
    'shadcn-nuxt'
  ],
  css: ['@/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  fonts: {
    families: [
      {
        name: 'Inter', provider: 'google', weights: [400, 500, 600, 700, 800],
      }
    ]
  },
  app: {
    head: {
      title: 'Clutch',
      titleTemplate: '%s | Clutch',
      htmlAttrs: {
        lang: 'en',
        class: 'font-primary font-normal antialiased'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=2' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    }
  },
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL,
      clutchAuthCookieName: process.env.NUXT_PUBLIC_CLUTCH_AUTH_COOKIE_NAME,
    }
  }
})