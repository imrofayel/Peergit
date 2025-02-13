<template>
  <div class="pb-10">
    <SiteHero />

    <div>
      <!-- Search Form -->
      <div class="flex gap-3 justify-center mt-3 items-center">
        <input
          v-model="username"
          type="text"
          placeholder="GitHub username"
          class="inline-flex items-center justify-center text-lg ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-0 p-3 py-2.5 rounded-2xl disabled:pointer-events-none disabled:opacity-50 shadow-xs gap-1 border border-neutral-200 placeholder:drop-shadow-xs bg-white hover:bg-neutral-50"
          @keyup.enter="analyzeProfile"
        />
        <UiButton
          @click="analyzeProfile"
          variant="outline"
          class="cursor-pointer rounded-2xl text-lg h-12"
          v-if="!loading"
        >
          {{ loading ? 'Thinking' : 'Think!' }}
        </UiButton>

        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" v-if="loading"><g stroke="currentColor"><circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="2.5"><animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150"/><animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0;-16;-59;-59"/></circle><animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>


      </div>

      <!-- Error Message -->
      <div v-if="error" class="m-6 p-4 bg-red-50 text-red-600 rounded-2xl">
        {{ error }}
      </div>

      <!-- Results -->
      <div v-if="analysis" class="flex flex-col gap-y-4 m-6" id="analysisContainer">
        <!-- Profile Info -->
        <div v-if="userData" class="flex items-center gap-4 p-4 rounded-lg">
          <img
            :src="userData.profile.avatar_url"
            :alt="userData.profile.login"
            class="w-20 h-20 rounded-full"
          />
          <div>
            <h2 class="text-2xl font-semibold">
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

          <NuxtLink :to="shareLink" target="_blank"><figure class="qrcode relative w-48 right-4">
            <vue-qrcode 
              :value="shareLink" 
              :scale="12"
              type="image/png"
              :color="{ dark: '#000000', light: '#ffffff' }"
              :options="{
              errorCorrectionLevel: 'H',
              width: 150,
              margin: 0
              }"
            />
            <img
              :src="userData.profile.avatar_url"
              :alt="userData.profile.login"
              class="absolute w-14 h-14 drop-shadow-sm rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
            </figure></NuxtLink>
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

  loading.value = true;
  error.value = '';
  analysis.value = '';
  userData.value = null;
  shareLink.value = '';

  try {
    const response = await $fetch(`/api/analyze?username=${encodeURIComponent(username.value)}`);

    userData.value = {
      profile: response.profile,
      stats: response.stats
    };
    analysis.value = response.analysis;

    // Use username for sharing instead of ID
    shareLink.value = `${window.location.origin}/${response.github_username}`;
  } catch (e: any) {
    error.value = e.data?.message || 'An error occurred while analyzing the profile';
  } finally {
    loading.value = false;
  }
}

// Handle auto-analyze from URL params
const route = useRoute();
onMounted(() => {
  if (route.query.username && route.query.autoAnalyze === 'true') {
    username.value = route.query.username as string;
    analyzeProfile();
  }
});

</script>
