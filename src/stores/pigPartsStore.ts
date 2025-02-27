// src/stores/pigPartsStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import partsData from '../data/pig-parts.json';

export interface ConnectionPoint {
  x: number;
  y: number;
}

export interface PigPart {
  id: string;
  name: string;
  path: string;
  connectionPoints: {
    [key: string]: ConnectionPoint;
  };
  unlocked: boolean;
}

export interface UserPig {
  bodyId: string;
  headId: string;
  earsId?: string;
  accessoriesIds?: string[];
}

export const usePigPartsStore = defineStore('pigParts', () => {
  // All available pig parts
  const bodies = ref<PigPart[]>(partsData.bodies);
  const heads = ref<PigPart[]>(partsData.heads);
  const ears = ref<PigPart[]>(partsData.ears);
  const accessories = ref<PigPart[]>(partsData.accessories);

  // Currently selected pig configuration
  const selectedPig = ref<UserPig>({
    bodyId: bodies.value[0]?.id || '',
    headId: heads.value[0]?.id || '',
  });

  // Computed properties for selected parts
  const selectedBody = computed(() =>
    bodies.value.find((part) => part.id === selectedPig.value.bodyId)
  );

  const selectedHead = computed(() =>
    heads.value.find((part) => part.id === selectedPig.value.headId)
  );

  const selectedEars = computed(() =>
    selectedPig.value.earsId
      ? ears.value.find((part) => part.id === selectedPig.value.earsId)
      : undefined
  );

  // Functions to update selections
  function selectBody(bodyId: string) {
    if (bodies.value.some((body) => body.id === bodyId)) {
      selectedPig.value.bodyId = bodyId;
    }
  }

  function selectHead(headId: string) {
    if (heads.value.some((head) => head.id === headId)) {
      selectedPig.value.headId = headId;
    }
  }

  function selectEars(earsId: string) {
    if (ears.value.some((ear) => ear.id === earsId)) {
      selectedPig.value.earsId = earsId;
    }
  }

  // Function to save a pig design
  function savePigDesign(name: string): UserPig {
    // In a real app, this would save to a database
    // For now, we'll just return the current pig configuration
    const pigDesign = { ...selectedPig.value, name };
    console.log('Saved pig design:', pigDesign);
    return pigDesign;
  }

  // Function to load a pig design
  function loadPigDesign(pigDesign: UserPig) {
    selectedPig.value = { ...pigDesign };
  }

  return {
    // All parts
    bodies,
    heads,
    ears,
    accessories,

    // Selected parts
    selectedPig,
    selectedBody,
    selectedHead,
    selectedEars,

    // Actions
    selectBody,
    selectHead,
    selectEars,
    savePigDesign,
    loadPigDesign,
  };
});
