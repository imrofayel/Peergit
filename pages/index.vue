<template>
  <div class="pb-10">
    <SiteHero />

    <div>
      <div class="flex gap-3 justify-center mt-3 items-center">
        <div
          class="max-w-[380px] w-full pl-3 p-2 flex items-center gap-x-2 justify-between rounded-3xl border border-gray-200/80 transition-all bg-white duration-300 shadow-xs drop-shadow-xs">
          <div class="flex items-center gap-x-2">
            <div><svg xmlns="http://www.w3.org/2000/svg" width="28" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" />
              </svg></div>
            <div class="flex items-center"><span class="lg:text-xl text-lg ">github.com/</span>
                <div class="relative"><input placeholder="username" v-model="username" type="text" :disabled="loading"
                  class="font-normal lg:text-xl w-full outline-none text-lg placeholder:text-gray-300 placeholder:font-normal"
                  title="Enter your username!" @keyup.enter="analyzeProfile"></div>
              </div>
          </div>
          <div><button @click="analyzeProfile" :disabled="loading"
              class="border border-gray-200 justify-center shrink-0 flex items-center font-semibold transition-all ease-in duration-75 whitespace-nowrap text-center select-none disabled:cursor-not-allowed gap-x-1 active:shadow-none rounded-3xl py-1.5 cursor-pointer h-10 w-10 drop-shadow-xs  bg-white"
              aria-label="Submit"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" v-if="!loading"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 12h14m-7-7l7 7l-7 7"/></svg>
            
              <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" v-if="loading">
          <g stroke="currentColor">
            <circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="2.5">
              <animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s"
                keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1"
                repeatCount="indefinite" values="0 150;42 150;42 150;42 150" />
              <animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s"
                keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1"
                repeatCount="indefinite" values="0;-16;-59;-59" />
            </circle>
            <animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate"
              values="0 12 12;360 12 12" />
          </g>
        </svg>
            
            
            </button></div>
        </div>

      </div>

      <!-- Error Message -->
      <div v-if="error" class="m-6 p-4 bg-red-50 text-red-600 rounded-2xl">
        {{ error }}
      </div>

      <!-- Results -->
      <div v-if="analysis" class="flex flex-col gap-y-4 m-6" id="analysisContainer">
        <!-- Profile Info -->
        <div v-if="userData" class="flex items-center gap-4 p-4 rounded-lg">
          <img :src="userData.profile.avatar_url" :alt="userData.profile.login" class="w-20 h-20 rounded-full" />
          <div>
            <h2 class="text-2xl font-medium">
              {{ userData.profile.name || userData.profile.login }}
            </h2>
            <p class="text-lg">{{ userData.profile.bio || 'No bio provided' }}</p>
          </div>
        </div>

        <!-- AI Analysis -->
        <div class="prose prose-lg max-w-none">
          <div class="flex flex-col drop-shadow-xs leading-relaxed text-lg gap-y-4">
            {{ analysis }}
          </div>
        </div>

        <!-- Shareable Link -->
        <div v-if="shareLink" class="mt-4 text-lg flex flex-col gap-y-1">
          <span class="drop-shadow-xs">Share with your friends or view again. Scan the QR code or click on it.</span>

          <NuxtLink :to="shareLink" target="_blank">
            <figure class="qrcode relative w-48 right-4">
              <vue-qrcode :value="shareLink" :scale="12" type="image/png" :color="{ dark: '#000000', light: '#ffffff' }"
                :options="{
                  errorCorrectionLevel: 'H',
                  width: 150,
                  margin: 0
                }" />
              <img :src="userData.profile.avatar_url" :alt="userData.profile.login"
                class="absolute w-13 h-13 drop-shadow-sm rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </figure>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import VueQrcode from 'vue-qrcode';
import { useRoute } from 'vue-router';

const username = ref('');
const loading = ref(false);
const error = ref('');
const analysis = ref('');
const userData = ref<any>(null);
const shareLink = ref('');

async function analyzeProfile() {
  if (!username.value.trim()) {
    error.value = 'Please enter a GitHub username';
    return;
  }

  const normalizedUsername = username.value.trim().toLowerCase();
  loading.value = true;
  error.value = '';
  analysis.value = '';
  userData.value = null;
  shareLink.value = '';

  try {
    const response = await $fetch(`/api/analyze?username=${encodeURIComponent(normalizedUsername)}`);
    
    userData.value = {
      profile: response.profile,
      stats: response.stats
    };
    analysis.value = response.analysis;
    shareLink.value = `${window.location.origin}/${normalizedUsername}`;
  } catch (e: any) {
    console.error('Analysis error:', e);
    error.value = e.data?.message || 'Failed to analyze profile';
    if (e.data?.redirect) {
      navigateTo(`/?username=${e.data.username}&autoAnalyze=true`);
    }
  } finally {
    loading.value = false;
  }
}

// Handle auto-analyze from URL params
const route = useRoute();
onMounted(() => {
  if (route.query.username && route.query.autoAnalyze === 'true') {
    username.value = (route.query.username as string).trim().toLowerCase();
    analyzeProfile();
  }
});

</script>