<!-- src/components/pig-designer/PigPreview.vue -->
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

const props = defineProps<{
  bodyComponent: string;
  headComponent: string;
}>();

// Use refs to store the actual SVG content and viewBox info
const bodySvgContent = ref('');
const headSvgContent = ref('');
const bodyViewBox = ref({ x: 0, y: 0, width: 0, height: 0 });
const headViewBox = ref({ x: 0, y: 0, width: 0, height: 0 });

// Connection points defined relative to each part's coordinate system
const bodyHeadConnection = ref({ x: 70, y: 40 });
const headBodyConnection = ref({ x: 20, y: 60 });

// Calculate the combined viewBox that encompasses all parts
const combinedViewBox = computed(() => {
  // Start with default values
  if (!bodyViewBox.value.width || !headViewBox.value.width) {
    return '0 0 200 200';
  }
  
  // Calculate the transformed position of the head
  const headTransformValues = getHeadTransform();
  const headX = headTransformValues.dx;
  const headY = headTransformValues.dy;
  
  // Calculate the bounds that contain both body and transformed head
  const minX = Math.min(bodyViewBox.value.x, headViewBox.value.x + headX);
  const minY = Math.min(bodyViewBox.value.y, headViewBox.value.y + headY);
  const maxX = Math.max(
    bodyViewBox.value.x + bodyViewBox.value.width,
    headViewBox.value.x + headViewBox.value.width + headX
  );
  const maxY = Math.max(
    bodyViewBox.value.y + bodyViewBox.value.height, 
    headViewBox.value.y + headViewBox.value.height + headY
  );
  
  // Add padding for better visibility
  const padding = 20;
  return `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
});

// Function to extract viewBox from SVG content
function extractViewBox(svgContent: string) {
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']*)["']/);
  if (viewBoxMatch && viewBoxMatch[1]) {
    const [x, y, width, height] = viewBoxMatch[1].split(/\s+/).map(Number);
    return { x, y, width, height };
  }
  return { x: 0, y: 0, width: 100, height: 100 }; // Default if not found
}

// Function to sanitize SVG content (remove outer svg tags, keeping inner content)
function sanitizeSvgContent(svgContent: string) {
  // Remove the outer <svg> and </svg> tags but keep the content inside
  return svgContent
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();
}

// Calculate head position to align connection points
function getHeadTransform() {
  // The offset needed to align the connection points
  const dx = bodyHeadConnection.value.x - headBodyConnection.value.x;
  const dy = bodyHeadConnection.value.y - headBodyConnection.value.y;
  return { dx, dy, transform: `translate(${dx} ${dy})` };
}

// Load SVG content
async function loadSvgContent() {
  try {
    // Fetch SVG content directly
    const bodyResponse = await fetch(props.bodyComponent);
    const headResponse = await fetch(props.headComponent);
    
    const bodyText = await bodyResponse.text();
    const headText = await headResponse.text();
    
    // Extract viewBox information
    bodyViewBox.value = extractViewBox(bodyText);
    headViewBox.value = extractViewBox(headText);
    
    // Sanitize content to remove outer svg tags
    bodySvgContent.value = sanitizeSvgContent(bodyText);
    headSvgContent.value = sanitizeSvgContent(headText);
  } catch (error) {
    console.error('Error loading SVG content:', error);
  }
}

// Computed prop for head transform
const headTransform = computed(() => {
  return getHeadTransform().transform;
});

// Watch for prop changes to reload SVG content
watch(() => [props.bodyComponent, props.headComponent], loadSvgContent);

// Initial load on mount
onMounted(loadSvgContent);

// Debug information to help with positioning
const debugInfo = computed(() => {
  return {
    body: bodyViewBox.value,
    head: headViewBox.value,
    bodyConnection: bodyHeadConnection.value,
    headConnection: headBodyConnection.value,
    transform: getHeadTransform()
  };
});
</script>

<template>
  <div class="h-96 bg-gray-50 rounded-lg flex flex-col">
    <div class="flex-grow flex items-center justify-center overflow-hidden">
      <!-- Single SVG container with all parts and calculated viewBox -->
      <svg :viewBox="combinedViewBox" class="w-full h-full max-w-md" preserveAspectRatio="xMidYMid meet">
        <!-- Coordinate system guide (for development) -->
        <g class="coordinate-guide" v-if="false">
          <line x1="-1000" y1="0" x2="1000" y2="0" stroke="red" stroke-width="1" />
          <line x1="0" y1="-1000" x2="0" y2="1000" stroke="blue" stroke-width="1" />
          <!-- Body connection point marker -->
          <circle :cx="bodyHeadConnection.x" :cy="bodyHeadConnection.y" r="3" fill="green" />
          <!-- Head connection point marker (transformed) -->
          <circle 
            :cx="headBodyConnection.x" 
            :cy="headBodyConnection.y" 
            r="3" 
            fill="purple" 
            :transform="headTransform" 
          />
        </g>
        
        <!-- Body group -->
        <g class="pig-body" v-html="bodySvgContent"></g>
        
        <!-- Head group with transform to align connection points -->
        <g class="pig-head" :transform="headTransform" v-html="headSvgContent"></g>
      </svg>
    </div>
    
    <!-- Debug panel (can be toggled for development) -->
    <div v-if="false" class="p-2 text-xs bg-gray-100 h-32 overflow-auto">
      <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
    </div>
    
    <!-- Connection point adjustment controls (for development) -->
    <div v-if="false" class="p-2 bg-gray-200 flex flex-wrap gap-2">
      <div>
        <label>Body X: <input type="number" v-model.number="bodyHeadConnection.x" /></label>
        <label>Body Y: <input type="number" v-model.number="bodyHeadConnection.y" /></label>
      </div>
      <div>
        <label>Head X: <input type="number" v-model.number="headBodyConnection.x" /></label>
        <label>Head Y: <input type="number" v-model.number="headBodyConnection.y" /></label>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Keep controls compact for development */
label {
  margin-right: 0.5rem;
  font-size: 0.75rem;
}
input[type="number"] {
  width: 4rem;
}
</style>