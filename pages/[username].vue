<template>
  <div class="pb-10">

    <div>
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center m-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><g stroke="currentColor"><circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="2.5"><animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150"/><animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0;-16;-59;-59"/></circle><animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>

      </div>

      <!-- Results -->
      <div v-else-if="data" class="flex flex-col gap-y-4 m-6">
        <!-- Profile Info -->
        <div class="flex items-center gap-4 p-4 rounded-lg">
          <img
            :src="data.profile.avatar_url"
            :alt="data.profile.login"
            class="w-20 h-20 rounded-full"
          />
          <div>
            <h2 class="text-2xl font-medium">
              {{ data.profile.name || data.profile.login }}
            </h2>
            <p class="text-lg">{{ data.profile.bio || 'No bio provided' }}</p>
          </div>
        </div>

        <!-- AI Analysis -->
        <div class="prose prose-lg max-w-none">
          <div class="flex flex-col drop-shadow-xs leading-relaxed text-lg gap-y-4">
            {{ data.analysis }}
          </div>
        </div>

                <!-- Shareable Link -->
                <div class="mt-4 text-lg flex flex-col gap-y-1">
          <span class="drop-shadow-xs">Share with your friends or view again. Scan the QR code or click on it.</span>

          <NuxtLink :to="`https://peergit.vercel.app/${data.profile.login}`" target="_blank"><figure class="qrcode relative w-48 right-4">
            <vue-qrcode 
              :value="`https://peergit.vercel.app/${data.profile.login}`"
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
              :src="data.profile.avatar_url"
              :alt="data.profile.login"
              class="absolute w-13 h-13 drop-shadow-sm rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
            </figure></NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
import VueQrcode from 'vue-qrcode';


// Add error handling to the fetch call
const router = useRouter();
const { data, pending, error } = await useFetch(`/api/analysis/user/${route.params.username}`, {
  onRequestError: ({ error }) => {
    console.error('Request error:', error)
  },
  onResponseError: ({ response }) => {
    if (response.status === 404) {
      router.push('/');
    }
    console.error('Response error:', response)
  }
});

// Handle composable error
if (error.value) {
  console.error('Composable error:', error.value);
  if (error.value?.statusCode === 404) {
    router.push('/');
  }
}

// Set page metadata
useHead({
  title: data.value ? `${data.value.profile.name || data.value.profile.login } | Peergit` : 'Loading Analysis | PeerGit',
  meta: [
    {
      name: 'description',
      content: data.value 
        ? `Check out the GitHub profile analysis for ${data.value.profile.name}`
        : 'Loading GitHub profile analysis'
    }
  ]
});
</script>
