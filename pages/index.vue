<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow-lg rounded-lg p-6">
        <h1 class="text-3xl font-bold text-center mb-8">GitHub Profile Analyzer</h1>
        
        <!-- Search Form -->
        <div class="mb-8">
          <div class="flex gap-4">
            <input
              v-model="username"
              type="text"
              placeholder="Enter GitHub username"
              class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="analyzeProfile"
            />
            <button
              @click="analyzeProfile"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Analyzing...' : 'Analyze' }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>

        <!-- Results -->
        <div v-if="analysis" class="space-y-6">
          <!-- Profile Info -->
          <div v-if="userData" class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              :src="userData.profile.avatar_url"
              :alt="userData.profile.login"
              class="w-16 h-16 rounded-full"
            />
            <div>
              <h2 class="text-xl font-semibold">{{ userData.profile.name || userData.profile.login }}</h2>
              <p class="text-gray-600">{{ userData.profile.bio || 'No bio provided' }}</p>
            </div>
          </div>

          <!-- AI Analysis -->
          <div class="prose max-w-none">
            <div class="whitespace-pre-wrap">{{ analysis }}</div>
          </div>

          <!-- Repository List -->
          <div v-if="userData?.repos.length" class="mt-8">
            <h3 class="text-xl font-semibold mb-4">Top Repositories</h3>
            <div class="space-y-4">
              <div
                v-for="repo in userData.repos"
                :key="repo.id"
                class="p-4 border rounded-lg hover:bg-gray-50"
              >
                <a
                  :href="repo.html_url"
                  target="_blank"
                  class="text-blue-600 hover:underline font-medium"
                >
                  {{ repo.name }}
                </a>
                <p class="text-gray-600 text-sm mt-1">
                  {{ repo.description || 'No description provided' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const username = ref('');
const loading = ref(false);
const error = ref('');
const analysis = ref('');
const userData = ref<any>(null);

async function analyzeProfile() {
  if (!username.value.trim()) {
    error.value = 'Please enter a GitHub username';
    return;
  }

  loading.value = true;
  error.value = '';
  analysis.value = '';
  userData.value = null;

  try {
    const response = await $fetch(`/api/analyze?username=${encodeURIComponent(username.value)}`);
    userData.value = {
      profile: response.profile,
      repos: response.repos
    };
    analysis.value = response.analysis;
  } catch (e: any) {
    error.value = e.data?.message || 'An error occurred while analyzing the profile';
  } finally {
    loading.value = false;
  }
}
</script>