<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { watch } from "vue";
import Dropdown from "@/components/Dropdown.vue";
import { useTarotStore } from "@/stores/tarotStore";

const router = useRouter();
const store = useTarotStore();
const { selectedSpread } = storeToRefs(store);

const spreadOptions = [
  { label: "One Card Spread", value: "one" },
  { label: "Three Card Spread", value: "three" },
  { label: "Five Card Spread", value: "five" },
] as const;

watch(selectedSpread, async (next) => {
  if (!next) return; 
  if (router.currentRoute.value.path !== "/") {
    await router.push("/");
  }
});

watch(
  () => router.currentRoute.value.path,
  (path) => {
    if (path !== "/") {
      selectedSpread.value = "";
    }
  }
);
</script>

<template>
  <nav
    class="w-full flex flex-col items-center justify-between gap-4 px-4 py-3"
  >
    <span class="font-semibold">In the Cards</span>

    <div class="flex flex-row gap-3">

        <button
            class="px-3 py-2 border rounded hover:bg-gray-50"
            type="button"
            @click="router.push('/about')"
        >
            About
        </button>

        <Dropdown
            label=""
            :options="spreadOptions"
            v-model="selectedSpread"
            placeholder="Choose a spread"
        />

        <button
            class="px-3 py-2 border rounded hover:bg-gray-50"
            type="button"
            @click="router.push('/library')"
        >
            Library
        </button>
    </div>
  </nav>
</template>
