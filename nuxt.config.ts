import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      geminiApiKey: process.env.GEMINI_API_KEY,
      githubToken: process.env.GITHUB_TOKEN
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['@nuxt/icon']
});