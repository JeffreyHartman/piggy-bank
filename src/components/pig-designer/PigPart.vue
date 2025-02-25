<!-- src/components/pig-designer/PigPart.vue -->
<script setup lang="ts">
import { computed } from 'vue';

// Define the type for connection points
interface ConnectionPoint {
  id: string;
  x: number;
  y: number;
}

// Define props for this component
const props = defineProps<{
  // Path to the SVG file
  svgPath: string;

  // SVG dimensions for proper scaling
  width: number;
  height: number;

  // Connection points for this part
  connectionPoints: ConnectionPoint[];

  // If this part connects to another, specify which connection point to use
  connectionId?: string;

  // The part this connects to (if any)
  connectedTo?: {
    connectionPoints: ConnectionPoint[];
    x: number;
    y: number;
  };

  // Base position (if not connected to another part)
  x?: number;
  y?: number;

  // Scaling factor
  scale?: number;
}>();

// Set default values for optional props
const scale = computed(() => props.scale || 1);
const x = computed(() => props.x || 0);
const y = computed(() => props.y || 0);

// Calculate position based on connection points if connected to another part
const position = computed(() => {
  // If not connected to another part, use the base position
  if (!props.connectedTo || !props.connectionId) {
    return { x: x.value, y: y.value };
  }

  // Find the connection points to align
  const sourcePoint = props.connectionPoints.find(
    (p) => p.id === props.connectionId
  );
  const targetPoint = props.connectedTo.connectionPoints.find(
    (p) => p.id === props.connectionId
  );

  // If either connection point is missing, fall back to base position
  if (!sourcePoint || !targetPoint) {
    return { x: x.value, y: y.value };
  }

  // Calculate the position that aligns the connection points
  return {
    x: props.connectedTo.x + targetPoint.x - sourcePoint.x * scale.value,
    y: props.connectedTo.y + targetPoint.y - sourcePoint.y * scale.value,
  };
});

// Set the SVG's transform style
const transform = computed(() => {
  return `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value})`;
});
</script>

<template>
  <img
    :src="svgPath"
    :style="{ transform }"
    class="absolute"
    :width="width * scale"
    :height="height * scale"
    alt="Pig part"
  />
</template>
