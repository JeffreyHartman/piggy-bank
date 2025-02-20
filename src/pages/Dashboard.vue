<!-- src/pages/Dashboard.vue -->
<script setup lang="ts">
import PigDisplay from '@/components/features/dashboard/PigDisplay.vue';
import StatsPanel from '@/components/features/dashboard/StatsPanel.vue';
import NotificationList from '@/components/features/dashboard/NotificationList.vue';
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl mb-8">Welcome, [User]</h1>
    <div class="grid grid-cols-12 gap-6">
      <!-- Left side - Pig Display -->
      <div class="col-span-6">
        <PigDisplay />
      </div>
      <!-- Right side - Stats -->
      <div class="col-span-6">
        <StatsPanel />
      </div>
      <!-- Bottom - Notifcations -->
      <div class="col-span-12">
        <NotificationList />
      </div>
    </div>
  </div>
</template>
