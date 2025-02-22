<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  bodyComponent: string;
  headComponent: string;
}>();

const body = computed(() => props.bodyComponent);
const head = computed(() => props.headComponent);
</script>

<template>
  <div class="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
    <!-- Container for our pig parts -->
    <div class="relative w-96 h-96">
      <!-- Body Layer -->
      <img :src="body" class="absolute inset-0 w-full h-full" alt="pig body" />

      <!-- Head Layer -->
      <img :src="head" class="absolute left-0 w-1/2 h-1/2" alt="pig head" />
    </div>
  </div>
</template>
