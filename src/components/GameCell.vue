<script setup lang="ts">
import { computed } from 'vue'

// GameCell component for individual tic-tac-toe cells

interface Props {
  value?: string
  index: number
  isWinning?: boolean
  disabled?: boolean
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  value: '',
  isWinning: false,
  disabled: false,
})

// Events this component can emit
const emit = defineEmits<{
  click: [index: number]
}>()

// Handle cell click
const handleClick = () => {
  if (!props.disabled && !props.value) {
    emit('click', props.index)
  }
}

// Computed classes for styling
const cellClasses = computed(() => [
  'bg-gray-100 border-2 border-gray-300 rounded-lg',
  'flex items-center justify-center',
  'text-4xl font-bold transition-colors',
  'aspect-square min-h-20 select-none',
  {
    'cursor-pointer hover:bg-gray-200': !props.disabled && !props.value,
    'cursor-not-allowed': props.disabled,
    'bg-green-200 border-green-400': props.isWinning,
    'text-blue-600': props.value === 'X',
    'text-red-600': props.value === 'O',
  },
])
</script>

<template>
  <div :class="cellClasses" @click="handleClick">
    {{ props.value }}
  </div>
</template>

<style scoped>
/* Component-specific styles */
</style>
