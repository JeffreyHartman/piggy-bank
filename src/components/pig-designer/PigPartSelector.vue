<script setup lang="ts">
interface PigPart {
  id: string;
  name: string;
  component: string;
}

const props = defineProps<{
  partType: string;
  parts: PigPart[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const cycleNext = () => {
  const index = props.parts.findIndex((part) => part.id === props.modelValue);
  const nextIndex = (index + 1) % props.parts.length;
  emit('update:modelValue', props.parts[nextIndex].id);
};

const cyclePrev = () => {
  const index = props.parts.findIndex((part) => part.id === props.modelValue);
  const prevIndex = (index - 1 + props.parts.length) % props.parts.length;
  emit('update:modelValue', props.parts[prevIndex].id);
};
</script>

<template>
  <div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
    <!-- Part Type Label-->
    <span class="font-medium capitalize w-24">{{ partType }}</span>

    <!-- Navigation Buttons-->
    <div class="flex gap-2">
      <button
        @click="cyclePrev"
        class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
      >
        ←
      </button>

      <!-- Current selection name-->
      <span class="px-4 py-2 min-2-[100px] text-center">
        {{ parts.find((p) => p.id === modelValue)?.name }}
      </span>

      <button
        @click="cycleNext"
        class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
      >
        →
      </button>
    </div>
  </div>
</template>
