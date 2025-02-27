<!-- src/components/pig-designer/PigPreview.vue -->
<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { SVG } from '@svgdotjs/svg.js';

const props = defineProps<{
  bodyComponent: string;
  headComponent: string;
}>();

// Reference to the container element
const svgContainer = ref<HTMLDivElement | null>(null);
// Reference to the SVG.js instance
const svgDrawing = ref<any>(null);

// Connection points defined relative to each part's coordinate system
const bodyHeadConnection = ref({ x: 70, y: 40 });
const headBodyConnection = ref({ x: 20, y: 60 });

// Keep track of the current viewBox to prevent flickering
const currentViewBox = ref('0 0 200 200');

// This will track our SVG elements
const bodyElement = ref<any>(null);
const headElement = ref<any>(null);

// Add debug logging to track SVG loading and manipulation
const logMessages = ref<string[]>([]);
function log(message: string) {
  console.log(message);
  logMessages.value.push(message);
  // Keep only the last 10 messages
  if (logMessages.value.length > 10) {
    logMessages.value.shift();
  }
}

// Function to clear the SVG container but maintain viewBox
function clearSvg() {
  if (svgDrawing.value) {
    // Store the current viewBox before clearing
    if (svgDrawing.value.viewbox) {
      const vb = svgDrawing.value.viewbox();
      if (vb && vb.width > 0) {
        currentViewBox.value = `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
        log(`Stored viewBox: ${currentViewBox.value}`);
      }
    }

    // Clear but preserve the viewBox
    const nested = svgDrawing.value.findOne('#main-container');
    if (nested) {
      nested.clear();
      log('Cleared SVG contents while preserving container');
    } else {
      // Full clear as fallback
      svgDrawing.value.clear();
      log('Full SVG clear (no container found)');
    }
  }
}

// Helper function to extract SVG content
async function fetchSvgContent(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`
      );
    }
    const text = await response.text();
    return text;
  } catch (error) {
    log(`Error fetching SVG: ${error}`);
    throw error;
  }
}

// Initialize the SVG drawing with a stable structure
function initializeSvgDrawing() {
  if (!svgContainer.value) return false;

  if (!svgDrawing.value) {
    // Create the main SVG drawing
    svgDrawing.value = SVG().addTo(svgContainer.value).size('100%', '100%');

    // Set the initial viewBox
    svgDrawing.value.viewbox(currentViewBox.value);

    // Create a nested group that will contain all content
    // This allows us to clear the content without affecting the main SVG
    svgDrawing.value.group().id('main-container');

    log('Initialized SVG drawing with stable container');
    return true;
  }

  return true;
}

// For development: Debug values to help with adjustment
const debug = ref(false);
function toggleDebug() {
  debug.value = !debug.value;

  // When toggling debug mode, update the pig SVG to show/hide markers
  const mainContainer = svgDrawing.value?.findOne('#main-container');
  if (mainContainer) {
    // Remove any existing debug markers
    const debugMarkers = mainContainer.findOne('#debug-markers');
    if (debugMarkers) {
      debugMarkers.remove();
    }

    // Only add markers if debug mode is now enabled
    if (debug.value) {
      updatePigSvg();
    }
  } else {
    // If no container yet, do a full update
    updatePigSvg();
  }
}

// Update function to handle changes to connection points
function updatePigSvg(rebuildAll = false) {
  if (!svgDrawing.value) {
    if (!initializeSvgDrawing()) return;
  }

  const mainContainer = svgDrawing.value.findOne('#main-container');
  if (!mainContainer) return;

  // If we need to fully rebuild or don't have elements yet
  if (rebuildAll || !bodyElement.value || !headElement.value) {
    buildPigSvg();
    return;
  }

  // Just update positions without rebuilding everything
  try {
    const dx = bodyHeadConnection.value.x - headBodyConnection.value.x;
    const dy = bodyHeadConnection.value.y - headBodyConnection.value.y;

    // Update head position
    headElement.value.transform({ translateX: dx, translateY: dy });
    log(`Updated head position: translate(${dx}, ${dy})`);

    // Remove any existing debug markers first
    const debugMarkers = mainContainer.findOne('#debug-markers');
    if (debugMarkers) {
      debugMarkers.remove();
    }

    // Update debug markers only if debug mode is enabled
    if (debug.value) {
      // Create new markers
      const newMarkers = mainContainer.group().id('debug-markers');

      // Body connection point - GREEN
      newMarkers
        .circle(3)
        .center(bodyHeadConnection.value.x, bodyHeadConnection.value.y)
        .fill('#00ff00')
        .stroke({ color: '#000', width: 1 })
        .opacity(0.9);

      // Head connection point (transformed) - RED
      newMarkers
        .circle(3)
        .center(
          dx + headBodyConnection.value.x,
          dy + headBodyConnection.value.y
        )
        .fill('#ff0000')
        .stroke({ color: '#000', width: 1 })
        .opacity(0.9);

      // Ensure markers are on top
      newMarkers.front();
    }
  } catch (error) {
    log(`Error updating positions: ${error}. Falling back to full rebuild.`);
    buildPigSvg();
  }
}

// Main function to build the pig SVG
async function buildPigSvg() {
  log('Building full pig SVG...');

  // Initialize or get the drawing
  if (!svgDrawing.value) {
    if (!initializeSvgDrawing()) return;
  }

  // Get the main container
  const mainContainer = svgDrawing.value.findOne('#main-container');
  if (!mainContainer) return;

  // Clear the container contents but maintain structure
  mainContainer.clear();

  // Set the stored viewBox immediately to prevent flickering
  svgDrawing.value.viewbox(currentViewBox.value);

  try {
    // Create a pig group within the main container
    const pigGroup = mainContainer.group().id('pig-group');

    // Fetch SVG content
    const [bodyText, headText] = await Promise.all([
      fetchSvgContent(props.bodyComponent),
      fetchSvgContent(props.headComponent),
    ]);

    // Add body
    const bodyGroup = pigGroup.group().id('body-group');
    const tempDiv = document.createElement('div');

    // Process body SVG
    tempDiv.innerHTML = bodyText;
    const svgElement = tempDiv.querySelector('svg');
    if (svgElement) {
      // Copy elements from the SVG
      Array.from(svgElement.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.tagName.toLowerCase() === 'path') {
            const path = bodyGroup.path(element.getAttribute('d') || '');
            path.fill(element.getAttribute('fill') || '#FFB6C1');
            path.stroke(element.getAttribute('stroke') || '#000');
            path.stroke({ width: element.getAttribute('stroke-width') || 1 });
          } else if (element.tagName.toLowerCase() === 'circle') {
            const circle = bodyGroup.circle(
              parseFloat(element.getAttribute('r') || '0') * 2
            );
            circle.move(
              parseFloat(element.getAttribute('cx') || '0') -
                parseFloat(element.getAttribute('r') || '0'),
              parseFloat(element.getAttribute('cy') || '0') -
                parseFloat(element.getAttribute('r') || '0')
            );
            circle.fill(element.getAttribute('fill') || '#FFB6C1');

            // Get stroke attributes and apply them correctly
            if (element.hasAttribute('stroke')) {
              const strokeColor = element.getAttribute('stroke');
              const strokeWidth = parseFloat(
                element.getAttribute('stroke-width') || '1'
              );
              circle.stroke({ color: strokeColor, width: strokeWidth });
            } else {
              circle.stroke('none');
            }
          } else if (element.tagName.toLowerCase() === 'ellipse') {
            const ellipse = bodyGroup.ellipse(
              parseFloat(element.getAttribute('rx') || '0') * 2,
              parseFloat(element.getAttribute('ry') || '0') * 2
            );
            ellipse.move(
              parseFloat(element.getAttribute('cx') || '0') -
                parseFloat(element.getAttribute('rx') || '0'),
              parseFloat(element.getAttribute('cy') || '0') -
                parseFloat(element.getAttribute('ry') || '0')
            );
            ellipse.fill(element.getAttribute('fill') || '#FFB6C1');

            if (element.hasAttribute('stroke')) {
              const strokeColor = element.getAttribute('stroke');
              const strokeWidth = parseFloat(
                element.getAttribute('stroke-width') || '1'
              );
              ellipse.stroke({ color: strokeColor, width: strokeWidth });
            } else {
              ellipse.stroke('none');
            }
          }
        }
      });
    }

    // Process head SVG
    const headGroup = pigGroup.group().id('head-group');
    tempDiv.innerHTML = headText;
    const headSvgElement = tempDiv.querySelector('svg');
    if (headSvgElement) {
      // Copy elements from the SVG
      Array.from(headSvgElement.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.tagName.toLowerCase() === 'path') {
            const path = headGroup.path(element.getAttribute('d') || '');
            path.fill(element.getAttribute('fill') || '#FFB6C1');
            path.stroke(element.getAttribute('stroke') || '#000');
            path.stroke({ width: element.getAttribute('stroke-width') || 1 });
          } else if (element.tagName.toLowerCase() === 'circle') {
            const circle = headGroup.circle(
              parseFloat(element.getAttribute('r') || '0') * 2
            );
            circle.move(
              parseFloat(element.getAttribute('cx') || '0') -
                parseFloat(element.getAttribute('r') || '0'),
              parseFloat(element.getAttribute('cy') || '0') -
                parseFloat(element.getAttribute('r') || '0')
            );
            circle.fill(element.getAttribute('fill') || '#FFB6C1');

            if (element.hasAttribute('stroke')) {
              const strokeColor = element.getAttribute('stroke');
              const strokeWidth = parseFloat(
                element.getAttribute('stroke-width') || '1'
              );
              circle.stroke({ color: strokeColor, width: strokeWidth });
            } else {
              circle.stroke('none');
            }
          } else if (element.tagName.toLowerCase() === 'ellipse') {
            const ellipse = headGroup.ellipse(
              parseFloat(element.getAttribute('rx') || '0') * 2,
              parseFloat(element.getAttribute('ry') || '0') * 2
            );
            ellipse.move(
              parseFloat(element.getAttribute('cx') || '0') -
                parseFloat(element.getAttribute('rx') || '0'),
              parseFloat(element.getAttribute('cy') || '0') -
                parseFloat(element.getAttribute('ry') || '0')
            );
            ellipse.fill(element.getAttribute('fill') || '#FFB6C1');

            if (element.hasAttribute('stroke')) {
              const strokeColor = element.getAttribute('stroke');
              const strokeWidth = parseFloat(
                element.getAttribute('stroke-width') || '1'
              );
              ellipse.stroke({ color: strokeColor, width: strokeWidth });
            } else {
              ellipse.stroke('none');
            }
          }
        }
      });
    }

    // Position the head to align with the body
    const dx = bodyHeadConnection.value.x - headBodyConnection.value.x;
    const dy = bodyHeadConnection.value.y - headBodyConnection.value.y;
    headGroup.transform({ translateX: dx, translateY: dy });

    // Store elements for future updates
    bodyElement.value = bodyGroup;
    headElement.value = headGroup;

    // Add debug markers if in debug mode
    if (debug.value) {
      const debugMarkers = pigGroup.group().id('debug-markers');

      // Body connection point - GREEN
      debugMarkers
        .circle(3)
        .center(bodyHeadConnection.value.x, bodyHeadConnection.value.y)
        .fill('#00ff00')
        .stroke({ color: '#000', width: 1 })
        .opacity(0.9);

      // Head connection point (transformed) - RED
      debugMarkers
        .circle(3)
        .center(
          dx + headBodyConnection.value.x,
          dy + headBodyConnection.value.y
        )
        .fill('#ff0000')
        .stroke({ color: '#000', width: 1 })
        .opacity(0.9);

      // Make sure debug markers are on top
      debugMarkers.front();
    }

    // Calculate the bbox only after a short delay to ensure all elements are rendered
    setTimeout(() => {
      try {
        const bbox = pigGroup.bbox();
        // Add padding
        const padding = 20;
        const newViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;

        // Only update viewBox if it's significantly different to avoid flicker
        if (
          currentViewBox.value === '0 0 200 200' ||
          hasSignificantViewBoxChange(currentViewBox.value, newViewBox)
        ) {
          currentViewBox.value = newViewBox;
          svgDrawing.value.viewbox(newViewBox);
          log(`Updated viewBox: ${newViewBox}`);
        } else {
          log('Kept current viewBox to prevent flicker');
        }
      } catch (error) {
        log(`Error calculating viewBox: ${error}`);
      }
    }, 50);
  } catch (error) {
    log(`Error building pig SVG: ${error}`);
    console.error('Error building pig SVG:', error);
  }
}

// Helper function to check if viewBox change is significant
function hasSignificantViewBoxChange(oldViewBox: string, newViewBox: string) {
  const oldParts = oldViewBox.split(' ').map(parseFloat);
  const newParts = newViewBox.split(' ').map(parseFloat);

  if (oldParts.length !== 4 || newParts.length !== 4) return true;

  // Check if any dimension changed by more than 10%
  for (let i = 0; i < 4; i++) {
    const oldVal = oldParts[i];
    const newVal = newParts[i];

    // For width and height (index 2 and 3)
    if (i >= 2) {
      if (Math.abs((newVal - oldVal) / oldVal) > 0.1) return true;
    }
    // For x and y position (index 0 and 1), use absolute difference
    else {
      if (Math.abs(newVal - oldVal) > 10) return true;
    }
  }

  return false;
}

// Watch for props changes
watch(
  () => [props.bodyComponent, props.headComponent],
  () => {
    // Full rebuild when parts change
    nextTick(() => buildPigSvg());
  }
);

// Update for connection point changes
watch(
  () => [
    bodyHeadConnection.value.x,
    bodyHeadConnection.value.y,
    headBodyConnection.value.x,
    headBodyConnection.value.y,
  ],
  () => {
    // Just update positions without a full rebuild
    updatePigSvg(false);
  }
);

// Initialize on mount
onMounted(async () => {
  await nextTick();
  buildPigSvg();
});
</script>

<template>
  <div class="h-96 bg-gray-50 rounded-lg flex flex-col relative">
    <div
      ref="svgContainer"
      class="flex-grow flex items-center justify-center overflow-hidden"
    ></div>

    <!-- Debug toggle button - always visible -->
    <button
      @click="toggleDebug"
      class="absolute top-4 right-4 bg-gray-200 text-xs p-1 rounded opacity-50 hover:opacity-100 z-50"
    >
      {{ debug ? 'Hide Debug' : 'Show Debug' }}
    </button>

    <!-- Debug panel - positioned as a right sidebar -->
    <div
      v-if="debug"
      class="absolute top-0 right-0 bottom-0 w-64 bg-white shadow-lg overflow-auto z-40"
    >
      <div
        class="p-2 bg-gray-200 border-b text-xs font-bold flex justify-between"
      >
        <span>Debug Controls</span>
        <button @click="toggleDebug" class="text-xs hover:underline">
          Hide Debug
        </button>
      </div>

      <!-- Connection point controls -->
      <div class="p-2 bg-gray-100 border-b">
        <div class="text-xs font-medium mb-1">Body Connection Point:</div>
        <div class="flex gap-2 mb-2">
          <label class="inline-flex items-center">
            X:
            <input
              type="number"
              v-model.number="bodyHeadConnection.x"
              class="ml-1 w-16 text-xs p-1 border rounded"
            />
          </label>
          <label class="inline-flex items-center">
            Y:
            <input
              type="number"
              v-model.number="bodyHeadConnection.y"
              class="ml-1 w-16 text-xs p-1 border rounded"
            />
          </label>
        </div>

        <div class="text-xs font-medium mb-1">Head Connection Point:</div>
        <div class="flex gap-2">
          <label class="inline-flex items-center">
            X:
            <input
              type="number"
              v-model.number="headBodyConnection.x"
              class="ml-1 w-16 text-xs p-1 border rounded"
            />
          </label>
          <label class="inline-flex items-center">
            Y:
            <input
              type="number"
              v-model.number="headBodyConnection.y"
              class="ml-1 w-16 text-xs p-1 border rounded"
            />
          </label>
        </div>
      </div>

      <!-- Debug log -->
      <div class="p-2 bg-gray-200 border-b text-xs font-bold">Debug Log</div>
      <div class="p-2 text-xs bg-gray-50 overflow-y-auto max-h-48">
        <div
          v-for="(msg, i) in logMessages"
          :key="i"
          class="mb-1 pb-1 border-b border-gray-100"
        >
          {{ msg }}
        </div>
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
input[type='number'] {
  width: 3rem;
}
</style>
