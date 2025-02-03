<!-- components/features/piggy-bank/PiggyBank.vue -->
<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Canvas, Circle } from 'fabric';

interface Props {
  coins: number;
  baseColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  baseColor: '#ffb6c1', // default to soft piggy-bank
});

const scale = computed(() => {
  const baseScale = 1;
  const growthFactor = 0.01; // Percentage growth per coin
  return baseScale + props.coins * growthFactor;
});

const piggyStyle = computed(() => ({
  transform: `scale(${scale.value})`, // CSS transform for size
  transformOrigin: 'center', // Scale from center point
  transition: 'all 2.0s ease-out', // Smooth animation when size changes
}));

const canvasEl = ref<HTMLCanvasElement | null>(null);
const fabricCanvas = ref<Canvas | null>(null);

function updateCanvasSize() {
  if (canvasEl.value && fabricCanvas.value) {
    const container = canvasEl.value.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvasEl.value.width = rect.width;
      canvasEl.value.height = rect.height;
      fabricCanvas.value.setDimensions(
        {
          width: rect.width,
          height: rect.height,
        },
        {
          cssOnly: false,
        }
      );

      // Scale the canvas viewport to math the SVG's coordinate system
      fabricCanvas.value.setViewportTransform([1, 0, 0, 1, 0, 0]);
    }
  }
}

onMounted(() => {
  if (canvasEl.value) {
    // Initialize the canvas with the same dimensions as its container
    const container = canvasEl.value.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();

      fabricCanvas.value = new Canvas(canvasEl.value, {
        width: rect.width,
        height: rect.height,
        backgroundColor: 'transparent',
        interactive: true,
        preserveObjectStacking: true,
      });

      // Add a test circle in the middle of the viewport
      const circle = new Circle({
        radius: 10,
        fill: 'red',
        left: rect.width / 2, // Center horizontally
        top: rect.height / 2, // Center vertically
        originX: 'center',
        originY: 'center',
      });

      fabricCanvas.value.add(circle);
    }
  }

  window.addEventListener('resize', updateCanvasSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize);
});
</script>

<template>
  <div class="piggy-containter grid place-items-center min-h-[200px] w-full">
    <div class="w-full max-w-[800px] aspect-square relative ">
      <!-- Default Piggy SVG -->
      <svg
        viewBox="-6.23 -6.23 75.463 75.463"
        class="w-full h-full transform-gpu absolute top-0 left-0 pointer-events-none"
      >
        <g :style="piggyStyle">
          <!-- Main piggy body -->
          <path
            d="M98,73.339c0-11.108-12.762-20.113-28.5-20.113A39,39,0,0,0,58.84,54.684a12.562,12.562,0,0,0-16.548.548l5.976,4.687a19.967,19.967,0,0,0-5.817,7.061,2.027,2.027,0,0,1-2.1,1.214H38.167A2.8,2.8,0,0,0,35.6,71.413l1.705,7.67a2.579,2.579,0,0,0,2.365,2.05h1.918A2.681,2.681,0,0,1,43.909,82.2,23.158,23.158,0,0,0,51.12,88.71l-.257,8.184A1.652,1.652,0,0,0,52.452,99h7.362A1.653,1.653,0,0,0,61.4,97.8l1.4-4.913a39.988,39.988,0,0,0,14.748-.258L79.032,97.8A1.653,1.653,0,0,0,80.621,99H88.14a1.652,1.652,0,0,0,1.588-2.106l-.5-9.046C94.63,84.187,98,79.042,98,73.339Z"
            :fill="props.baseColor"
            :stroke="props.baseColor"
            stroke-width="0.5"
            transform="translate(-34.537 -37)"
          />
          <!-- Eye -->
          <circle cx="14.463" cy="29" r="2" fill="#333" />
          <!-- arc for coin slot -->
          <path
            d="M27.463,22.006A28.446,28.446,0,0,1,43.463,22.3"
            fill="none"
            stroke="#333"
            stroke-width="1"
            stroke-linecap="round"
          />
        </g>
      </svg>
      <canvas ref="canvasEl" class="absolute top-0 left-0 w-full h-full">
      </canvas>
    </div>
  </div>
</template>

<style scoped>
.piggy-containter {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}
</style>
