<!-- src/components/pig-designer/PigPartSelector.vue -->
<script setup lang="ts">
import { ref } from 'vue';

interface PigPart {
  id: string;
  name: string;
  path?: string;
  unlocked?: boolean;
}

const props = defineProps<{
  partType: string;
  parts: PigPart[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function selectPart(partId: string) {
  emit('update:modelValue', partId);
}

// Check if the part is unlocked
function isUnlocked(part: PigPart): boolean {
  return part.unlocked !== false; // Default to true if not specified
}

// Display a preview of the part
function getPreviewSrc(part: PigPart): string {
  return part.path || '';
}
</script>

<template>
  <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
    <h2 class="text-lg font-medium mb-3">Select {{ partType }}</h2>

    <div class="space-y-2">
      <div
        v-for="part in parts"
        :key="part.id"
        class="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
        :class="{ 'bg-pink-50 border border-pink-200': part.id === modelValue }"
        @click="isUnlocked(part) ? selectPart(part.id) : null"
      >
        <!-- Preview image or SVG if available -->
        <div
          class="w-12 h-12 bg-white rounded border flex items-center justify-center mr-3 overflow-hidden"
        >
          <img
            v-if="getPreviewSrc(part)"
            :src="getPreviewSrc(part)"
            :alt="part.name"
            class="w-10 h-10 object-contain"
          />
          <div v-else class="text-gray-300 text-xs text-center">No preview</div>
        </div>

        <!-- Part name and selection indicator -->
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span :class="{ 'text-gray-400': !isUnlocked(part) }">
              {{ part.name }}
              <span v-if="!isUnlocked(part)" class="text-xs ml-1"
                >(Locked)</span
              >
            </span>

            <div
              v-if="part.id === modelValue"
              class="h-3 w-3 rounded-full bg-pink-500"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
