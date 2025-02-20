<!-- src/components/features/dashboard/StatsPanel.vue -->
<script setup lang="ts"></script>
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl mb-4">Piggy Stats</h2>
    <div class="space-y-4">
      <div>
        <p class="text-gray-600">Saved Coins</p>
        <p class="text-2xl">145 🪙</p>
      </div>
      <div>
        <p class="text-gray-600">Current Size</p>
        <p class="text-2xl">Level 3</p>
      </div>
      <div>
        <p class="text-gray-600">Progress to Next Level</p>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-green-600 h-2.5 rounded-full w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
</template>
