<script setup lang="ts">
import { computed, ref } from "vue";

type Option = { label: string; value: string };

const props = defineProps<{
  label?: string;
  options: Option[];
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isOpen = ref(false);

const selectedLabel = computed(() => {
  const match = props.options.find((o) => o.value === props.modelValue);
  return match?.label ?? props.placeholder ?? "Select...";
});

const selectOption = (value: string) => {
  emit("update:modelValue", value);
  isOpen.value = false;
};
</script>

<template>
  <div class="relative inline-block w-56">
    <label v-if="label" class="block mb-2 text-sm font-medium">{{
      label
    }}</label>

    <button
      type="button"
      class="w-full px-4 py-2 border rounded bg-white text-left"
      @click="isOpen = !isOpen"
    >
      {{ selectedLabel }}
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-2 w-full border rounded bg-white shadow"
    >
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="block w-full px-4 py-2 text-left hover:bg-gray-100"
        @click="selectOption(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>
