<!-- src/components/pig-designer/PigPreview.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const props = defineProps<{
  bodyComponent: string;
  headComponent: string;
}>();

// Use refs to store the actual SVG content
const bodySvgContent = ref('');
const headSvgContent = ref('');

// Connection points defined in our coordinate system
const bodyHeadConnection = { x: 20, y: 30 };
const headBodyConnection = { x: 50, y: 30 };

// Load SVG content
onMounted(async () => {
  // Fetch SVG content directly
  const bodyResponse = await fetch(props.bodyComponent);
  const headResponse = await fetch(props.headComponent);

  bodySvgContent.value = await bodyResponse.text();
  headSvgContent.value = await headResponse.text();
});

// Calculate head position to align connection points
const headTransform = computed(() => {
  // The offset needed to align the connection points
  const dx = bodyHeadConnection.x - headBodyConnection.x;
  const dy = bodyHeadConnection.y - headBodyConnection.y;

  return `translate(${dx} ${dy})`;
});
</script>

<template>
  <div class="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
    <!-- Single SVG container with all parts -->
    <svg viewBox="0 0 200 100" class="w-full h-full max-w-md">
      <!-- Body group -->
      <g v-html="bodySvgContent"></g>

      <!-- Head group with transform -->
      <g :transform="headTransform" v-html="headSvgContent"></g>
    </svg>
  </div>
</template>
