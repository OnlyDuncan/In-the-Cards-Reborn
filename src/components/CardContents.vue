<script setup lang="ts">
// @ts-ignore - Vue 3 import issue in TypeScript
import { ref, computed } from "vue";

const { title, orientation, image, meaning } = defineProps<{
  title: string;
  orientation: "Upright" | "Reversed";
  image: string;
  meaning: string;
}>();

const isFlipped = ref(false);
const isOpen = ref(false);

const orientationClass = computed(() => ({
  reversed: orientation === "Reversed",
}));

const flipCard = () => {
  isFlipped.value = true;
};
</script>

<template>
  <div class="card-container" @click="flipCard">
    <div class="card" :class="{ flipped: isFlipped }">
      <!-- BACK (shown first) -->
      <div class="card-face card-back">
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
    <div class="modal-content">
      <h1>{{ title }}</h1>
      <img
        :src="`${image}`"
        :class="orientationClass"
        alt="Tarot Card"
      />
      <p>{{ meaning }}</p>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  perspective: 1200px;
  width: 200px;
  height: 300px;
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
  border-radius: 12px;
  overflow: hidden;
}

.card-back {
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-front {
  transform: rotateY(180deg);
  background: #fff;
}

.reversed {
  transform: rotate(180deg);
}
</style>
