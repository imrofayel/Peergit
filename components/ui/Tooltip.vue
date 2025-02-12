<template>
  <div
    class="group relative"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <Motion
      v-if="isHovered"
      :initial="{
        opacity: 0,
        y: 4,
        scale: 0.9,
      }"
      :animate="{
        opacity: 1,
        y: 0,
        scale: 1,
      }"
      :transition="{
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }"
      class="absolute z-50 px-3 py-1 text-[15px] whitespace-nowrap rounded-lg border border-neutral-200 bg-white/80 hover:bg-neutral-50"
      :class="tooltipPositionClass"
    >
      {{ text }}
    </Motion>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { Motion } from "motion-v";
import { computed, ref } from "vue";

const props = defineProps<{
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}>();

const isHovered = ref(false);

const tooltipPositionClass = computed(() => {
  switch (props.position) {
    case 'bottom':
      return 'bottom-9 left-1/2 transform -translate-x-1/2';
    case 'left':
      return 'right-9 top-1/2 transform -translate-y-1/2';
    case 'right':
      return 'left-9 top-1/2 transform -translate-y-1/2';
    default:
      return '-top-9 left-1/2 transform -translate-x-1/2';
  }
});
</script>
