<!-- src/pages/PigDesigner.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import PigPartSelector from '@/components/pig-designer/PigPartSelector.vue';
import PigPreview from '@/components/pig-designer/PigPreview.vue';
import { usePigPartsStore } from '../stores/pigPartsStore';

// Use the centralized Pinia store for pig parts
const pigPartsStore = usePigPartsStore();

// Computed properties for the selected components' paths
const selectedBodyComponent = computed(
  () => pigPartsStore.selectedBody?.path || ''
);

const selectedHeadComponent = computed(
  () => pigPartsStore.selectedHead?.path || ''
);

// Handler functions to select parts
function selectBody(bodyId: string) {
  pigPartsStore.selectBody(bodyId);
}

function selectHead(headId: string) {
  pigPartsStore.selectHead(headId);
}

// Compute the selected IDs for v-model binding
const selectedBodyId = computed({
  get: () => pigPartsStore.selectedPig.bodyId,
  set: (value: string) => pigPartsStore.selectBody(value),
});

const selectedHeadId = computed({
  get: () => pigPartsStore.selectedPig.headId,
  set: (value: string) => pigPartsStore.selectHead(value),
});

// Function to save the current pig design
function savePigDesign() {
  const timestamp = new Date().toLocaleTimeString();
  const designName = `My Pig Design (${timestamp})`;
  const savedPig = pigPartsStore.savePigDesign(designName);

  // In a real app, you would save this to your backend/database
  alert(`Pig design saved! Name: ${designName}`);
}
</script>

<template>
  <div class="flex-gap-8">
    <h1 class="text-2xl mb-8">Pig Designer</h1>

    <div class="flex flex-wrap gap-8">
      <!-- Controls Panel-->
      <div class="w-80 space-y-4">
        <PigPartSelector
          partType="Body"
          :parts="pigPartsStore.bodies"
          v-model="selectedBodyId"
        />
        <PigPartSelector
          partType="Head"
          :parts="pigPartsStore.heads"
          v-model="selectedHeadId"
        />

        <!-- Save Button -->
        <div class="mt-8">
          <button
            @click="savePigDesign"
            class="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
          >
            Save Pig Design
          </button>
        </div>
      </div>

      <!-- Preview Area -->
      <div class="flex-1 bg-white rounded-lg shadow p-8">
        <PigPreview
          :bodyComponent="selectedBodyComponent"
          :headComponent="selectedHeadComponent"
        />
      </div>
    </div>
  </div>
</template>
