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

const userQuestion = ref("");
const aiAnswer = ref("");
const spread = ref(deckbuilder(props.cards).slice(0, 1));

const reshuffle = () => {
  spread.value = deckbuilder(props.cards).slice(0, 1);
};

const handleUserQuestion = async () => {
  try {
    console.log("Ask the Cards clicked");
    console.log("Question:", userQuestion.value);

    const cardTitles = spread.value.map((c) => c.title);
    console.log("Card titles payload:", cardTitles);

    const res = await fetch("http://127.0.0.1:5050/api/askCards", {
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
  <div class="flex justify-center gap-8">
    <CardContents v-for="(card, i) in spread" :key="i" v-bind="card" />
  </div>

  <div class="flex justify-center mt-6">
    <button @click="reshuffle">Reshuffle</button>
  </div>

  <input v-model="userQuestion" placeholder="Ask your question..." />
  <div v-if="aiAnswer" class="mt-6 text-center">
    <strong>AI Answer:</strong>
    <p>{{ aiAnswer }}</p>
  </div>
  <button @click="handleUserQuestion">Ask the Cards</button>
</template>