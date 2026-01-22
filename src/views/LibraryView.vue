<template>
  <div class="flex">
    <h1>Library</h1>
    <Library :cards="store.libraryCards" />
  </div>
</template>

<script setup lang="ts">
import { useTarotStore } from "@/stores/tarotStore";

const store = useTarotStore();
</script>

<style scoped>
</style>
