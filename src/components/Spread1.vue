<script setup lang="ts">
import CardContents from "./CardContents.vue";
import deckbuilder from "@/composables/deckbuilder";
// @ts-ignore - Vue 3 import issue in TypeScript
import { ref } from "vue";

type TarotCard = {
  title: string;
  orientation: string;
  image: string;
  meaning: string;
};

const props = defineProps<{
  cards: TarotCard[][];
}>();

const userQuestion = ref("");
const aiAnswer = ref("");
const spread = ref<TarotCard[]>(deckbuilder(props.cards).slice(0, 1));
const revealPrompt = ref(false);

const reshuffle = () => {
  spread.value = deckbuilder(props.cards).slice(0, 1);
  userQuestion.value = "";
  aiAnswer.value = "";
};

const handleUserQuestion = async () => {
  try {
    console.log("Ask the Cards clicked");
    console.log("Question:", userQuestion.value);

    const cardTitles = spread.value.map((c: TarotCard) => c.title);
    console.log("Card titles payload:", cardTitles);

    const res = await fetch("/api/askCards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: userQuestion.value,
        cards: cardTitles,
      }),
    });

    const text = await res.text();
    console.log("API status:", res.status);
    console.log("API raw response:", text);

    if (!res.ok) {
      throw new Error(`Backend error ${res.status}: ${text}`);
    }

    const aiResponseData = JSON.parse(text);
    aiAnswer.value = `You asked: "${userQuestion.value}". The cards say: ${aiResponseData.answer}`;
  } catch (e) {
    console.error(e);
    aiAnswer.value = `Error: ${e instanceof Error ? e.message : String(e)}`;
  }
};
</script>

<template>
  <div class="flex flex-col items-center md:flex-row justify-center gap-8 p-20">
    <CardContents v-for="(card, i) in spread" :key="i" v-bind="card" @flipped="flippedCount++" />
  </div>

  <div class="flex justify-center mt-6 button-gold mx-auto w-40 mb-10 spider">
    <button @click="reshuffle">Reshuffle</button>
  </div>

  <div v-if="revealPrompt" class="flex flex-col justify-center mx-auto mt-5 gap-3 p-30">
    <div class="flex justify-center">
      <input v-model="userQuestion" class="pl-3 px-5 py-2 crimson" placeholder="What's on your mind?" />
    </div>
    <div class="flex justify-center">
      <div class="button-gold mb-10">
          <button @click="handleUserQuestion" class="m-3 spider">Ask the Cards</button>
      </div>
    </div>
    <div v-if="aiAnswer" class="mt-6 text-white text-center p-20 spider">
        <strong>The Cards Speak:</strong>
        <p class="crimson">{{ aiAnswer }}</p>
    </div>
  </div>
</template>
