<script setup lang="ts">
// GameBoard component for displaying the 3x3 tic-tac-toe grid

interface Props {
  board?: string[]
}

// Props with default empty board
const props = withDefaults(defineProps<Props>(), {
  board: () => ['', '', '', '', '', '', '', '', ''],
})

// Events this component can emit
const emit = defineEmits<{
  cellClick: [index: number]
}>()

// Handle cell click and emit to parent
const handleCellClick = (index: number) => {
  emit('cellClick', index)
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="grid grid-cols-3 gap-2 w-72 h-72 mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div
        v-for="(cell, index) in props.board"
        :key="index"
        class="bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors text-4xl font-bold aspect-square min-h-20"
        @click="handleCellClick(index)"
      >
        {{ cell }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles */
</style>
