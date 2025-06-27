<script setup lang="ts">
// Enhanced GameBoard component with animations and visual effects

interface Props {
  board?: string[]
  winningLine?: number[] | null
  canMakeMove?: boolean
  isProcessing?: boolean
}

// Props with default empty board
const props = withDefaults(defineProps<Props>(), {
  board: () => ['', '', '', '', '', '', '', '', ''],
  winningLine: null,
  canMakeMove: true,
  isProcessing: false
})

// Events this component can emit
const emit = defineEmits<{
  cellClick: [cellIndex: number]
}>()

// Handle cell click and emit to parent
const handleCellClick = (cellIndex: number) => {
  if (props.canMakeMove && props.board[cellIndex] === '' && !props.isProcessing) {
    emit('cellClick', cellIndex)
  }
}

// Check if cell is part of winning line
const isWinningCell = (cellIndex: number): boolean => {
  return props.winningLine?.includes(cellIndex) ?? false
}

// Check if cell was recently played (for animation)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isNewMove = (_cellIndex: number): boolean => {
  // This could be enhanced to track the last move
  return false
}

// Get cell animation class
const getCellAnimationClass = (cell: string, cellIndex: number): string => {
  if (isWinningCell(cellIndex)) return 'animate-winning-cell'
  if (isNewMove(cellIndex)) return 'animate-new-move'
  if (cell !== '') return 'animate-cell-appear'
  return ''
}
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Game Board Container -->
    <div
      class="grid grid-cols-3 gap-3 w-80 h-80 mx-auto p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200 transition-all duration-300"
      :class="{ 'opacity-75 pointer-events-none': isProcessing }"
    >
      <!-- Game Cells -->
      <div
        v-for="(cell, cellIndex) in props.board"
        :key="cellIndex"
        :class="[
          'relative border-2 rounded-xl flex items-center justify-center text-5xl font-bold aspect-square transition-all duration-300 transform select-none',
          {
            // Empty cell states
            'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:from-gray-100 hover:to-gray-200 hover:scale-105 cursor-pointer hover:shadow-lg group':
              cell === '' && props.canMakeMove && !props.isProcessing,
            'bg-gray-200 border-gray-400 cursor-not-allowed opacity-60':
              cell === '' && (!props.canMakeMove || props.isProcessing),

            // X cell states
            'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 text-blue-700 shadow-lg':
              cell === 'X' && !isWinningCell(cellIndex),
            'bg-gradient-to-br from-blue-200 to-blue-300 border-blue-500 text-blue-800 shadow-xl ring-4 ring-blue-200 animate-pulse scale-110':
              cell === 'X' && isWinningCell(cellIndex),

            // O cell states
            'bg-gradient-to-br from-red-100 to-red-200 border-red-400 text-red-700 shadow-lg':
              cell === 'O' && !isWinningCell(cellIndex),
            'bg-gradient-to-br from-red-200 to-red-300 border-red-500 text-red-800 shadow-xl ring-4 ring-red-200 animate-pulse scale-110':
              cell === 'O' && isWinningCell(cellIndex),
          },
          getCellAnimationClass(cell, cellIndex)
        ]"
        @click="handleCellClick(cellIndex)"
      >
        <!-- Cell Content -->
        <span
          v-if="cell"
          class="transition-all duration-300 transform"
          :class="{
            'animate-bounce': isWinningCell(cellIndex),
            'animate-fade-in': !isWinningCell(cellIndex)
          }"
        >
          {{ cell }}
        </span>

        <!-- Hover Effect for Empty Cells -->
        <div
          v-if="cell === '' && props.canMakeMove && !props.isProcessing"
          class="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
        />

        <!-- Cell Index Helper (for development) -->
        <div
          v-if="cell === '' && props.canMakeMove"
          class="absolute top-1 left-1 text-xs text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity duration-200"
        >
          {{ cellIndex }}
        </div>
      </div>
    </div>

    <!-- Processing Overlay -->
    <div
      v-if="props.isProcessing"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-xl"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes cell-appear {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(180deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1) rotate(90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes new-move {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}

@keyframes winning-cell {
  0%, 100% {
    transform: scale(1.1) rotate(0deg);
  }
  25% {
    transform: scale(1.15) rotate(1deg);
  }
  75% {
    transform: scale(1.15) rotate(-1deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-cell-appear {
  animation: cell-appear 0.6s ease-out;
}

.animate-new-move {
  animation: new-move 0.8s ease-out;
}

.animate-winning-cell {
  animation: winning-cell 1s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}

/* Enhanced hover effects */
.group:hover .group-hover\:opacity-30 {
  transition: opacity 0.3s ease;
}

/* Subtle cell glow effect */
.group:hover {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}

/* Disabled state styles */
.pointer-events-none {
  pointer-events: none;
}
</style>
