<script setup lang="ts">
import Spread1 from "@/components/Spread1.vue";
import Library from "@/components/Library.vue";
import { useTarotStore } from "@/stores/tarotStore";

const store = useTarotStore();

// Trigger fetch if needed
if (!store.isInitialized && !store.loading) {
  store.fetchCards();
}
</script>

<template>
  <div class="flex" style="background-color: #cffafbff">
    <div v-if="store.loading">Loading cards...</div>

    <div v-else-if="store.error">Something went wrong.</div>

    <div v-else-if="store.hasCards" class="flex-col">
      <!--
      <Library :cards="store.libraryCards" />
      -->
      <Spread1 :cards="store.allCards" />
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
