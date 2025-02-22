<!-- src/components/dashboard/PigDisplay.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const goToDesigner = () => {
  router.push({ name: 'PigDesigner' });
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <button
        @click="goToDesigner"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Edit Pig
      </button>
      <h2 class="text-xl mb-4">Your Pig</h2>
    </div>
    <div class="h-64 bg-pink-100 rounded-lg flex items-center justify-center">
      <span class="text-6xl">🐷</span>
    </div>
  </div>
</template>
