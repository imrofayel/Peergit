<template>
  <div class="pb-10">

    <div>
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center m-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g stroke="currentColor"><circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="2.5"><animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150"/><animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0;-16;-59;-59"/></circle><animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="m-6 p-4 bg-red-50 text-red-600 rounded-2xl">
        {{ error.message }}
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
            <h2 class="text-2xl font-semibold">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

// Fetch data using built-in composable
const { data, pending, error } = await useFetch(`/api/analysis/${route.params.id}`);

// Set page metadata
useHead({
  title: data.value ? `${data.value.profile.name} | Peergit` : 'Loading Analysis | PeerGit',
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

<style>

</style>