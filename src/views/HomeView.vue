<template>
  <div class="home">
    <h1>Home View</h1>
    
    <!-- Show loading state -->
    <div v-if="loading">Loading cards...</div>
    
    <!-- Show error if any -->
    <div v-if="error" class="error">{{ error }}</div>
    
    <!-- Display cards -->
    <div v-if="!loading && !error" class="cards-container">
      <div v-for="card in cards" :key="card.id" class="card">
        <h3>{{ card.name }}</h3>
        <p>{{ card.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTarotStore } from '@/stores/tarotStore'

// Access the store
const tarotStore = useTarotStore()

// Destructure reactive properties from the store
const { cards, loading, error } = tarotStore

// Access store actions
const { fetchCards } = tarotStore

// Fetch cards when component mounts
onMounted(() => {
  fetchCards()
})
</script>

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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>