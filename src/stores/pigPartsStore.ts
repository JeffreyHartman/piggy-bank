import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PigPart, ConnectionPoint } from '../types/pig';

export const usePigPartsStore = defineStore('pigParts', () => {
  // State
  const availableParts = ref<PigPart[]>([
    {
      id: 'body-default',
      name: 'Default Body',
      type: 'body',
      svgPath: '/src/assets/pig-parts/bodies/default.svg',
      connectionPoints: {
        head: { x: 70, y: 40 },
      },
      unlocked: true,
      colorOptions: ['#FFB6C1', '#FFC0CB', '#FFDAB9'],
    },
    {
      id: 'head-round',
      name: 'Round Head',
      type: 'head',
      svgPath: '/src/assets/pig-parts/heads/round.svg',
      connectionPoints: {
        body: { x: 20, y: 60 },
      },
      unlocked: true,
      colorOptions: ['#FFB6C1', '#FFC0CB', '#FFDAB9'],
    },
    {
      id: 'head-oval',
      name: 'Oval Head',
      type: 'head',
      svgPath: '/src/assets/pig-parts/heads/oval.svg',
      connectionPoints: {
        body: { x: 25, y: 65 },
      },
      unlocked: true,
      colorOptions: ['#FFB6C1', '#FFC0CB', '#FFDAB9'],
    },
    // Add more parts here as you create them
  ]);

  // Current selected parts
  const selectedParts = ref<{ [key: string]: string }>({
    body: 'body-default',
    head: 'head-round',
  });

  // Getters
  const getPartsByType = computed(() => (type: string) => {
    return availableParts.value.filter((part) => part.type === type);
  });

  const getSelectedPart = computed(() => (type: string) => {
    const selectedId = selectedParts.value[type];
    return availableParts.value.find((part) => part.id === selectedId);
  });

  // Actions
  function selectPart(type: string, partId: string) {
    if (
      availableParts.value.some(
        (part) => part.id === partId && part.type === type
      )
    ) {
      selectedParts.value[type] = partId;
    }
  }

  function addNewPart(part: PigPart) {
    // Check if part with this ID already exists
    if (!availableParts.value.some((p) => p.id === part.id)) {
      availableParts.value.push(part);
    }
  }

  function updatePartConnectionPoint(
    partId: string,
    connectionName: string,
    point: ConnectionPoint
  ) {
    const partIndex = availableParts.value.findIndex((p) => p.id === partId);
    if (partIndex !== -1) {
      const part = availableParts.value[partIndex];
      part.connectionPoints = {
        ...part.connectionPoints,
        [connectionName]: point,
      };
      // Update the part in the array
      availableParts.value[partIndex] = { ...part };
    }
  }

  return {
    availableParts,
    selectedParts,
    getPartsByType,
    getSelectedPart,
    selectPart,
    addNewPart,
    updatePartConnectionPoint,
  };
});
