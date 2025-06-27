<script setup lang="ts">
import { ref } from 'vue'
import GameBoard from './components/GameBoard.vue'
import GameStatus from './components/GameStatus.vue'
import DifficultySelector from './components/DifficultySelector.vue'
import type { GameMode, AIDifficulty } from './components/DifficultySelector.vue'

// Demo state for showcasing components
const demoBoard = ref(['X', '', 'O', '', 'X', '', 'O', '', ''])
const currentPlayer = ref('X')
const gameMode = ref<GameMode>('human-vs-human')
const aiDifficulty = ref<AIDifficulty>('easy')
const moveCount = ref(5)
const winner = ref('')
const isTie = ref(false)

// Handle cell clicks from GameBoard
const handleCellClick = (index: number) => {
  console.log(`Cell ${index} clicked`)
  // For demo purposes, just log the click
  // Actual game logic will be implemented in Step 3
}

// Handle new game from GameStatus
const handleNewGame = () => {
  console.log('New game requested')
  demoBoard.value = ['', '', '', '', '', '', '', '', '']
  currentPlayer.value = 'X'
  moveCount.value = 0
  winner.value = ''
  isTie.value = false
}

// Handle game mode change from DifficultySelector
const handleGameModeChange = (mode: GameMode) => {
  console.log('Game mode changed to:', mode)
  gameMode.value = mode
}

// Handle difficulty change from DifficultySelector
const handleDifficultyChange = (difficulty: AIDifficulty) => {
  console.log('AI difficulty changed to:', difficulty)
  aiDifficulty.value = difficulty
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">🎮 Tic Tac Toe</h1>
        <p class="text-gray-600">Vue 3 + TypeScript + Tailwind CSS</p>
        <p class="text-sm text-green-600 font-medium mt-2">
          ✅ Step 2: Component Structure Complete
        </p>
      </div>

      <!-- Main Game Layout -->
      <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column: Game Settings -->
        <div class="flex flex-col gap-6">
          <DifficultySelector
            :game-mode="gameMode"
            :ai-difficulty="aiDifficulty"
            @game-mode-change="handleGameModeChange"
            @difficulty-change="handleDifficultyChange"
          />

          <GameStatus
            :current-player="currentPlayer"
            :winner="winner"
            :is-tie="isTie"
            :game-mode="
              gameMode === 'human-vs-human' ? 'Human vs Human' : `Human vs AI (${aiDifficulty})`
            "
            :move-count="moveCount"
            @new-game="handleNewGame"
          />
        </div>

        <!-- Right Column: Game Board -->
        <div class="flex items-center justify-center">
          <GameBoard :board="demoBoard" @cell-click="handleCellClick" />
        </div>
      </div>

      <!-- Component Information -->
      <div class="mt-12 max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Component Structure Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 class="font-semibold text-gray-700 mb-2">✅ Components Created:</h3>
            <ul class="text-gray-600">
              <li class="mb-1">• GameBoard.vue - 3x3 grid layout</li>
              <li class="mb-1">• GameCell.vue - Individual cells</li>
              <li class="mb-1">• GameStatus.vue - Status display</li>
              <li>• DifficultySelector.vue - AI settings</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 mb-2">✅ Features:</h3>
            <ul class="text-gray-600">
              <li class="mb-1">• TypeScript prop/emit interfaces</li>
              <li class="mb-1">• Tailwind CSS styling</li>
              <li class="mb-1">• Responsive layout</li>
              <li>• Component communication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional component-specific styles if needed */
</style>
