<script setup lang="ts">
import { useTarotStore } from "@/stores/tarotStore";
import CardContents from "@/components/CardContents.vue";
// @ts-ignore - Vue 3 import issue in TypeScript
import { computed, onMounted } from "vue";

const store = useTarotStore();

if (!store.isInitialized && !store.loading) {
  store.fetchCards();
}

const libraryCards = computed(() => store.libraryCards);
const majorArcanaCards = computed(() => store.majorArcanaCards);
const suitCups = computed(() => store.suitCups);
const suitWands = computed(() => store.suitWands);
const suitPentacles = computed(() => store.suitPentacles);
const suitSwords = computed(() => store.suitSwords);

onMounted(() => {
  const key = "reloaded-library-once";
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, "1");
    window.location.reload();
  } else {
    sessionStorage.removeItem(key);
  }
});
</script>

<template>
  <div class="flex">
    <h1>Major Arcana</h1>
    <ul class="flex flex-wrap gap-3">
      <li
        v-for="card in majorArcanaCards"
        :key="card.title + '-' + card.image"
        class="w-48"
      >
        <CardContents v-bind="card" :flippable="false" :initiallyFlipped="true" />
      </li>
    </ul>
    <h1>Suit of Swords</h1>
    <ul class="flex flex-wrap gap-3">
      <li
        v-for="card in suitSwords"
        :key="card.title + '-' + card.image"
        class="w-48"
      >
         <CardContents v-bind="card" :flippable="false" :initiallyFlipped="true" />
      </li>
    </ul>
    <h1>Suit of Cups</h1>
    <ul class="flex flex-wrap gap-3">
      <li
        v-for="card in suitCups"
        :key="card.title + '-' + card.image"
        class="w-48"
      >
         <CardContents v-bind="card" :flippable="false" :initiallyFlipped="true" />
      </li>
    </ul>
    <h1>Suit of Wands</h1>
    <ul class="flex flex-wrap gap-3">
      <li
        v-for="card in suitWands"
        :key="card.title + '-' + card.image"
        class="w-48"
      >
         <CardContents v-bind="card" :flippable="false" :initiallyFlipped="true" />
      </li>
    </ul>
    <h1>Suit of Pentacles</h1>
    <ul class="flex flex-wrap gap-3">
      <li
        v-for="card in suitPentacles"
        :key="card.title + '-' + card.image"
        class="w-48"
      >
         <CardContents v-bind="card" :flippable="false" :initiallyFlipped="true" />
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
