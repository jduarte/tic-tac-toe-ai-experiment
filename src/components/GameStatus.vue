<script setup lang="ts">
import { computed } from 'vue'

// GameStatus component for displaying current game status

interface Props {
  currentPlayer?: string
  currentPlayerDisplay?: string
  winner?: string | null
  isTie?: boolean
  isGameOver?: boolean
  gameMode?: string
  moveCount?: number
  isProcessing?: boolean
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  currentPlayer: 'X',
  currentPlayerDisplay: 'Player X',
  winner: null,
  isTie: false,
  isGameOver: false,
  gameMode: 'Human vs Human',
  moveCount: 0,
  isProcessing: false
})

// Events this component can emit
const emit = defineEmits<{
  newGame: []
}>()

// Computed status message
const statusMessage = computed(() => {
  if (props.winner) {
    return `🎉 Player ${props.winner} Wins!`
  }
  if (props.isTie) {
    return '🤝 It\'s a Tie!'
  }
  if (props.isProcessing) {
    return '⏳ Processing move...'
  }
  return `Current: ${props.currentPlayerDisplay}`
})

// Computed status classes
const statusClasses = computed(() => [
  'text-center p-4 rounded-lg',
  {
    'bg-green-100 text-green-800': props.winner,
    'bg-yellow-100 text-yellow-800': props.isTie,
    'bg-blue-100 text-blue-800': !props.winner && !props.isTie,
  }
])
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Main Status Display -->
    <div :class="statusClasses">
      <h2 class="text-2xl font-bold mb-2">
        {{ statusMessage }}
      </h2>

      <!-- Game Info -->
      <div class="text-sm">
        <p class="mb-1"><strong>Mode:</strong> {{ props.gameMode }}</p>
        <p><strong>Moves:</strong> {{ props.moveCount }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 flex justify-center">
      <button
        @click="emit('newGame')"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        New Game
      </button>
    </div>

    <!-- Game Over Actions -->
    <div v-if="props.winner || props.isTie" class="mt-3 text-center">
      <p class="text-sm text-gray-600">
        Game Over! Click "New Game" to play again.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles */
</style>