<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="bg-gray-100 p-4 shadow">
    <div class="container mx-auto flex items-center gap-8">
      <!-- Logo/Home -->
      <RouterLink to="/" class="flex items-center gap-2">
        <div class="bg-pink-200 p-2 rounded-full">🐷</div>
        <span class="font-bold text-lg">Piggy Bank</span>
      </RouterLink>

      <!-- Navigation Links -->
      <div class="flex gap-6">
        <RouterLink
          :to="{ name: 'Dashboard' }"
          class="hover:text-blue-600 transition-colors"
          active-class="text-blue-600"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          :to="{ name: 'PigDesigner' }"
          class="hover:text-blue-600 transition-colors"
          active-class="text-blue-600"
        >
          Design Pig
        </RouterLink>
        <!-- <RouterLink
          :to="{ name: 'Leaderboard' }"
          class="hover:text-blue-600 transition-colors"
          active-class="text-blue-600"
        >
          Leaderboard
        </RouterLink> -->
      </div>
    </div>
  </nav>
</template>
