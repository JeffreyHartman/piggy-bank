<!-- src/pages/PigDesigner.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';
import PigPartSelector from '@/components/pig-designer/PigPartSelector.vue';
import PigPreview from '@/components/pig-designer/PigPreview.vue';

const bodyOptions = [
  {
    id: 'default',
    name: 'Default Body',
    component: '/src/assets/pig-parts/bodies/default.svg',
  },
];

const headOptions = [
  {
    id: 'round',
    name: 'Round Head',
    component: '/src/assets/pig-parts/heads/round.svg',
  },
  {
    id: 'oval',
    name: 'Oval Head',
    component: '/src/assets/pig-parts/heads/oval.svg',
  },
];

// Track selected parts
const selectedBody = ref<string>(bodyOptions[0].id);
const selectedHead = ref<string>(headOptions[0].id);

const selectedBodyComponent = computed(
  () =>
    bodyOptions.find((option) => option.id === selectedBody.value)?.component
);

const selectedHeadComponent = computed(
  () =>
    headOptions.find((option) => option.id === selectedHead.value)?.component
);
</script>

<template>
  <div class="flex-gap-8">
    <h1 class="text-2xl mb-8">Pig Designer</h1>
    <!-- Controls Panel-->
    <div class="w-80 space-y-4">
      <PigPartSelector
        partType="Body"
        :parts="bodyOptions"
        v-model="selectedBody"
      />
      <PigPartSelector
        partType="Head"
        :parts="headOptions"
        v-model="selectedHead"
      />
    </div>

    <!-- Preview Area -->
    <div class="flex-1 bg-white rounded-lg shadow p-8">
      <PigPreview
        :bodyComponent="selectedBodyComponent"
        :headComponent="selectedHeadComponent"
      />
    </div>
  </div>
</template>
