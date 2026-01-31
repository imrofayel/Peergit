import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      geminiApiKey: process.env.GEMINI_API_KEY,
      githubToken: process.env.GITHUB_TOKEN,
      geminiModel: process.env.GEMINI_MODEL
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['@nuxt/icon', '@nuxtjs/sitemap', '@nuxtjs/robots'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Peergit',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: "Discover a fun, playful, and engaging analysis of a GitHub user's profile!" },
        { name: 'keywords', content: 'GitHub profile analysis, GitHub user insights, developer journey, casual coding analysis, fun GitHub profile review, coding humor, repo insights, developer personality, GitHub tips, GitHub profile critique, developer evolution, top languages, most starred repo, beginner coding tips, fun coding reviews, coding profile roast, developer improvement tips' },
        { property: 'og:title', content: 'Peergit - a GitHub Peer for you!' },
        { property: 'og:description', content: "Discover a fun, playful, and engaging analysis of a GitHub user's profile!" },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/og-image.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Peergit - a GitHub Peer for you!' },
        { name: 'twitter:description', content: "Discover a fun, playful, and engaging analysis of a GitHub user's profile!" },
        { name: 'twitter:image', content: '/og-image.jpg' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://peergit.vercel.app' }
      ]
    }
  },
  site: {
    url: 'https://peergit.vercel.app'
  }
});