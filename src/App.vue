<!-- App.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import PiggyBank from './components/features/piggy-bank/PiggyBank.vue';

const coins = ref(0);
const color = ref('#ffb6c1');

function earnCoin() {
  coins.value++;
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl mb-4">Piggy Bank Demo</h1>

    <div class="flex gap-4 mb-8">
      <button
        @click="earnCoin"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
      >
        Earn Coin
      </button>

      <input
        type="color"
        v-model="color"
        class="w-20 h-10"
        title="Change piggy color"
      />
    </div>

    <div class="flex flex-col items-center">
      <PiggyBank :coins="coins" :baseColor="color" />
      <p class="mt-4 text-lg">Coins: {{ coins }}</p>
    </div>
  </div>
</template>
