<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView } from 'vue-router';
import TopNav from './components/layout/TopNav.vue';
</script>

<template>
  <TopNav />
  <RouterView />
</template>
