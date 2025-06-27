<script setup lang="ts">
import { computed } from 'vue'

// Enhanced GameStatus component with animations and enhanced features

interface Props {
  currentPlayer?: string
  currentPlayerDisplay?: string
  winner?: string | null
  isTie?: boolean
  isGameOver?: boolean
  gameMode?: string
  moveCount?: number
  isProcessing?: boolean
  stats?: {
    gamesPlayed: number
    humanWins: number
    aiWins: number
    ties: number
  } | null
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
  isProcessing: false,
  stats: null,
})

// Events this component can emit
const emit = defineEmits<{
  newGame: []
  undoMove: []
  resetStats: []
}>()

// Computed status message
const statusMessage = computed(() => {
  if (props.winner) {
    return `🎉 Player ${props.winner} Wins!`
  }
  if (props.isTie) {
    return "🤝 It's a Tie!"
  }
  if (props.isProcessing) {
    return '⏳ Processing move...'
  }
  return `Current: ${props.currentPlayerDisplay}`
})

// Computed status classes for main display
const statusClasses = computed(() => [
  'text-center p-6 rounded-xl transition-all duration-500 transform',
  {
    'bg-gradient-to-br from-green-50 to-emerald-100 text-green-800 border border-green-200 scale-105':
      props.winner,
    'bg-gradient-to-br from-yellow-50 to-orange-100 text-yellow-800 border border-yellow-200 scale-105':
      props.isTie,
    'bg-gradient-to-br from-indigo-50 to-purple-100 text-indigo-800 border border-indigo-200':
      props.isProcessing,
    'bg-gradient-to-br from-white to-gray-50 text-gray-800 border border-gray-200':
      !props.winner && !props.isTie && !props.isProcessing,
  },
])

// Computed game stats display
const gameStatsDisplay = computed(() => {
  if (!props.stats) return null

  return {
    total: props.stats.gamesPlayed,
    human: props.stats.humanWins,
    ai: props.stats.aiWins,
    ties: props.stats.ties,
    humanWinRate:
      props.stats.gamesPlayed > 0
        ? ((props.stats.humanWins / props.stats.gamesPlayed) * 100).toFixed(1)
        : '0',
    aiWinRate:
      props.stats.gamesPlayed > 0
        ? ((props.stats.aiWins / props.stats.gamesPlayed) * 100).toFixed(1)
        : '0',
  }
})

const showUndo = computed(() => props.moveCount > 0 && !props.isGameOver && !props.isProcessing)
</script>

<template>
  <div class="w-full max-w-lg mx-auto space-y-6">
    <!-- Main Status Display -->
    <div :class="statusClasses">
      <h2
        class="text-3xl font-bold mb-4 transition-all duration-300"
        :class="{
          'animate-bounce': props.winner && !props.isTie,
          'animate-pulse': props.isTie || props.isProcessing,
        }"
      >
        {{ statusMessage }}
      </h2>

      <!-- Game Info Grid -->
      <div class="grid grid-cols-2 gap-4 text-sm mb-4">
        <div class="bg-white bg-opacity-50 rounded-lg p-3 backdrop-blur-sm">
          <div class="text-gray-600 font-medium">Mode</div>
          <div class="font-bold text-lg">{{ props.gameMode }}</div>
        </div>
        <div class="bg-white bg-opacity-50 rounded-lg p-3 backdrop-blur-sm">
          <div class="text-gray-600 font-medium">Moves</div>
          <div class="font-bold text-lg">{{ props.moveCount }}</div>
        </div>
      </div>

      <!-- Winner Celebration -->
      <div
        v-if="props.winner && !props.isTie"
        class="mb-4 p-4 bg-white bg-opacity-70 rounded-xl animate-fade-in"
      >
        <div class="text-5xl mb-2 animate-bounce">🏆</div>
        <div class="font-semibold">Congratulations! Player {{ props.winner }} wins!</div>
      </div>

      <!-- Tie Game Display -->
      <div v-if="props.isTie" class="mb-4 p-4 bg-white bg-opacity-70 rounded-xl animate-fade-in">
        <div class="text-5xl mb-2 animate-pulse">🤝</div>
        <div class="font-semibold">It's a tie! Great game!</div>
      </div>

      <!-- Processing Indicator -->
      <div v-if="props.isProcessing" class="mb-4 p-4 bg-white bg-opacity-70 rounded-xl">
        <div class="flex items-center justify-center gap-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span class="font-semibold">AI is thinking...</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 justify-center">
      <button
        @click="emit('newGame')"
        class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="props.isProcessing"
      >
        <span class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          New Game
        </span>
      </button>

      <button
        v-if="showUndo"
        @click="emit('undoMove')"
        class="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <span class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          Undo
        </span>
      </button>
    </div>

    <!-- Game Statistics -->
    <div
      v-if="gameStatsDisplay && gameStatsDisplay.total > 0"
      class="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-lg"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Statistics</h3>
        <button
          @click="emit('resetStats')"
          class="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
        >
          Reset
        </button>
      </div>

      <div class="grid grid-cols-4 gap-3 text-center text-sm">
        <div class="bg-blue-100 rounded-lg p-3 border border-blue-200">
          <div class="text-blue-600 font-medium">Games</div>
          <div class="text-blue-800 font-bold text-xl">{{ gameStatsDisplay.total }}</div>
        </div>
        <div class="bg-green-100 rounded-lg p-3 border border-green-200">
          <div class="text-green-600 font-medium">Human</div>
          <div class="text-green-800 font-bold text-xl">{{ gameStatsDisplay.human }}</div>
          <div class="text-green-600 text-xs">{{ gameStatsDisplay.humanWinRate }}%</div>
        </div>
        <div class="bg-red-100 rounded-lg p-3 border border-red-200">
          <div class="text-red-600 font-medium">AI</div>
          <div class="text-red-800 font-bold text-xl">{{ gameStatsDisplay.ai }}</div>
          <div class="text-red-600 text-xs">{{ gameStatsDisplay.aiWinRate }}%</div>
        </div>
        <div class="bg-yellow-100 rounded-lg p-3 border border-yellow-200">
          <div class="text-yellow-600 font-medium">Ties</div>
          <div class="text-yellow-800 font-bold text-xl">{{ gameStatsDisplay.ties }}</div>
        </div>
      </div>
    </div>

    <!-- Game Over Actions -->
    <div v-if="props.isGameOver" class="text-center animate-fade-in">
      <p class="text-sm text-gray-600 bg-gray-100 rounded-lg p-3 border border-gray-200">
        Game Over!
        {{ props.winner ? 'Congratulations to the winner!' : 'Good game everyone!' }}
        Start a new game to play again.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Enhanced button hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Gradient background animation */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Disabled state styles */
button:disabled {
  transform: none !important;
  cursor: not-allowed;
}

/* Loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
