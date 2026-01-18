<script setup lang="ts">
import CardContents from "./CardContents.vue";
import deckbuilder from "@/composables/deckbuilder";
import { ref } from "vue";

const props = defineProps<{
  cards: Array<{
    Title: string;
    Orientation: string;
    Image: string;
    Meaning: string;
  }>;
}>();

const spread = ref(deckbuilder(props.cards).slice(0, 3));

const reshuffle = () => {
  spread.value = deckbuilder(props.cards).slice(0, 3);
};
</script>

<template>
  <div class="flex justify-center gap-8">
    <CardContents
      v-for="(card, i) in spread"
      :key="i"
      v-bind="card"
    />
  </div>

  <div class="flex justify-center mt-6">
    <button @click="reshuffle">Reshuffle</button>
  </div>
</template>

