<script setup lang="ts">
// GameBoard component for displaying the 3x3 tic-tac-toe grid

interface Props {
  board?: string[]
  winningLine?: number[] | null
  canMakeMove?: boolean
}

// Props with default empty board
const props = withDefaults(defineProps<Props>(), {
  board: () => ['', '', '', '', '', '', '', '', ''],
  winningLine: null,
  canMakeMove: true
})

// Events this component can emit
const emit = defineEmits<{
  cellClick: [index: number]
}>()

// Handle cell click and emit to parent
const handleCellClick = (cellIndex: number) => {
  if (props.canMakeMove && props.board[cellIndex] === '') {
    emit('cellClick', cellIndex)
  }
}

// Check if cell is part of winning line
const isWinningCell = (cellIndex: number): boolean => {
  return props.winningLine?.includes(cellIndex) ?? false
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="grid grid-cols-3 gap-2 w-72 h-72 mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div
        v-for="(cell, cellIndex) in props.board"
        :key="cellIndex"
        :class="[
          'border-2 rounded-lg flex items-center justify-center text-4xl font-bold aspect-square min-h-20 transition-all duration-200',
          {
            'cursor-pointer hover:bg-gray-200': props.canMakeMove && cell === '',
            'cursor-not-allowed': !props.canMakeMove || cell !== '',
            'bg-gray-100 border-gray-300': !isWinningCell(cellIndex),
            'bg-green-200 border-green-400 animate-pulse': isWinningCell(cellIndex),
            'text-blue-600': cell === 'X',
            'text-red-600': cell === 'O'
          }
        ]"
        @click="handleCellClick(cellIndex)"
      >
        {{ cell }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles */
</style>