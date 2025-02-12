<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow-lg rounded-lg p-6">
        <h1 class="text-3xl font-bold text-center mb-8">GitHub Story Generator</h1>
        
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
              {{ loading ? 'Writing story...' : 'Tell me their story' }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>

        <!-- Results -->
        <div v-if="analysis" class="space-y-8">
          <!-- Profile Info -->
          <div v-if="userData" class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              :src="userData.profile.avatar_url"
              :alt="userData.profile.login"
              class="w-20 h-20 rounded-full"
            />
            <div>
              <h2 class="text-2xl font-semibold">{{ userData.profile.name || userData.profile.login }}</h2>
              <p class="text-gray-600">{{ userData.profile.bio || 'No bio provided' }}</p>
              <p class="text-sm text-gray-500 mt-1">
                {{ userData.profile.location || 'Location unknown' }} · Joined {{ new Date(userData.profile.created_at).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div v-if="userData?.stats" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 bg-blue-50 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-600">{{ userData.stats.totalStars }}</div>
              <div class="text-sm text-gray-600">Total Stars</div>
            </div>
            <div class="p-4 bg-green-50 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600">{{ userData.stats.totalForks }}</div>
              <div class="text-sm text-gray-600">Total Forks</div>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg text-center">
              <div class="text-2xl font-bold text-purple-600">{{ userData.profile.public_repos }}</div>
              <div class="text-sm text-gray-600">Repositories</div>
            </div>
            <div class="p-4 bg-pink-50 rounded-lg text-center">
              <div class="text-2xl font-bold text-pink-600">{{ userData.profile.followers }}</div>
              <div class="text-sm text-gray-600">Followers</div>
            </div>
          </div>

          <!-- AI Analysis -->
          <div class="prose prose-lg max-w-none">
            <div class="text-gray-800 leading-relaxed space-y-4">{{ analysis }}</div>
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
      stats: response.stats
    };
    analysis.value = response.analysis;
  } catch (e: any) {
    error.value = e.data?.message || 'An error occurred while analyzing the profile';
  } finally {
    loading.value = false;
  }
}
</script>