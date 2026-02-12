<script setup lang="ts">
// @ts-ignore - Vue 3 import issue in TypeScript
import { ref, computed } from "vue";

const {
  title,
  orientation,
  image,
  meaning,
  flippable = true,
  initiallyFlipped = false,
} = defineProps<{
  title: string;
  orientation: "Upright" | "Reversed";
  image: string;
  meaning: string;
  flippable?: boolean;
  initiallyFlipped?: boolean;
}>();

const isFlipped = ref(initiallyFlipped);
const isOpen = ref(false);
const emit = defineEmits<{ (e: "flipped"): void }>();

const orientationClass = computed(() => ({
  reversed: orientation === "Reversed",
}));

const flipCard = () => {
  if (!flippable) return;
  if (isFlipped.value) return;
  isFlipped.value = true;
  emit("flipped");
};
</script>

<template>
  <div class="card-container" @click="flipCard">
    <div class="card" :class="{ flipped: isFlipped }">
      <!-- BACK (shown first) -->
      <div v-if="!initiallyFlipped" class="card-face card-back">
        <img src="/Images/CardBack.webp" alt="Card Back" />
      </div>

      <!-- FRONT (revealed after flip) -->
      <div class="card-face card-front">
        <img
          :src="`${image}`"
          :class="orientationClass"
          alt="Tarot Card"
          @click.stop="isOpen = true"
        />
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="isOpen" class="modal-overlay" @click.self="isOpen = false">
    <div class="modal-content flex flex-col">
      <h1 class="text-white mb-5 flex justify-center spider">{{ title }}</h1>
      <img :src="`${image}`" :class="orientationClass" class="modalImage" alt="Tarot Card" />
      <p class="text-white m-5 crimson">{{ meaning }}</p>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  perspective: 1200px;
  width: 200px;
  height: 350px;
  cursor: pointer;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  overflow: hidden;
}

.card-back {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-front {
  transform: rotateY(180deg);
  background: transparent;
}

.reversed {
  transform: rotate(180deg);
}

.modalImage {
    height: 450px;
    width: auto;
    aspect-ratio: 200 / 350;
    margin: 0 auto;
}
</style>
