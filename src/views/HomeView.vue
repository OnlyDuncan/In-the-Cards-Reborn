<script setup lang="ts">
import Spread1 from "@/components/Spread1.vue";
import Spread2 from "@/components/Spread2.vue";
import Spread3 from "@/components/Spread3.vue";
import { useTarotStore } from "@/stores/tarotStore";

const store = useTarotStore();

// Trigger fetch if needed
if (!store.isInitialized && !store.loading) {
  store.fetchCards();
}
</script>

<template>
  <div class="flex w-full justify-center">
    <div v-if="store.loading">Loading cards...</div>

    <div v-else-if="store.error">Something went wrong.</div>

    <div v-else-if="store.hasCards" class="flex flex-col items-center w-full">
      <div class="mt-6 w-full flex-col justify-center mx-auto">
        <Spread1
          v-if="store.selectedSpread === 'one'"
          :cards="store.allCards"
        />
        <Spread3
          v-else-if="store.selectedSpread === 'five'"
          :cards="store.allCards"
        />
        <Spread2 v-else :cards="store.allCards" />
      </div>
    </div>

    <div v-else>No cards available.</div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}

.error {
  color: red;
  background: #ffe6e6;
  padding: 10px;
  border-radius: 4px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
