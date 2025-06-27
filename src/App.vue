<script setup lang="ts">
import { useGame } from './composables/useGame'
import GameBoard from './components/GameBoard.vue'
import GameStatus from './components/GameStatus.vue'
import DifficultySelector from './components/DifficultySelector.vue'

const game = useGame()

function handleCellClick(index: number) {
  game.makeMove(index)
}

function handleNewGame() {
  game.newGame()
}

function handleModeChange(mode: 'human-vs-human' | 'human-vs-ai') {
  game.changeGameMode(mode)
}

function handleDifficultyChange(difficulty: 'easy' | 'medium' | 'hard') {
  game.changeAIDifficulty(difficulty)
}

function handleAIPlayerChange(player: 'X' | 'O') {
  game.changeAIPlayer(player)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">

      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          🎮 Tic Tac Toe
        </h1>
        <p class="text-gray-600">
          Vue 3 + TypeScript + Tailwind CSS
        </p>
        <p class="text-sm text-green-600 font-medium mt-2">
          ✅ Step 3: Game State Management Complete
        </p>
      </div>

      <!-- Main Game Layout -->
      <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Left Column: Game Settings -->
        <div class="flex flex-col gap-6">
          <DifficultySelector
            :game-mode="game.gameMode.value"
            :ai-difficulty="game.aiDifficulty.value"
            :ai-player="game.aiPlayer.value"
            @game-mode-change="handleModeChange"
            @difficulty-change="handleDifficultyChange"
            @ai-player-change="handleAIPlayerChange"
          />

          <GameStatus
            :current-player="game.currentPlayer.value"
            :current-player-display="game.currentPlayerDisplay.value"
            :winner="game.winner.value"
            :is-tie="game.status.value === 'tie'"
            :is-game-over="game.isGameOver.value"
            :game-mode="game.getGameModeDisplay()"
            :move-count="game.moveCount.value"
            :is-processing="game.isProcessingMove.value"
            @new-game="handleNewGame"
          />
        </div>

        <!-- Right Column: Game Board -->
        <div class="flex items-center justify-center">
          <GameBoard
            :board="game.board.value"
            :winning-line="game.winningLine.value"
            :can-make-move="game.canMakeMove.value"
            @cell-click="handleCellClick"
          />
        </div>
      </div>

      <!-- Game Stats -->
      <div class="mt-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6" v-if="game.stats.value.gamesPlayed > 0">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Game Statistics</h2>
        <div class="grid grid-cols-4 gap-4 text-center">
          <div class="bg-blue-50 p-3 rounded">
            <div class="text-2xl font-bold text-blue-600">{{ game.stats.value.gamesPlayed }}</div>
            <div class="text-sm text-gray-600">Games</div>
          </div>
          <div class="bg-green-50 p-3 rounded" v-if="game.isAIEnabled.value">
            <div class="text-2xl font-bold text-green-600">{{ game.stats.value.humanWins }}</div>
            <div class="text-sm text-gray-600">Human Wins</div>
          </div>
          <div class="bg-red-50 p-3 rounded" v-if="game.isAIEnabled.value">
            <div class="text-2xl font-bold text-red-600">{{ game.stats.value.aiWins }}</div>
            <div class="text-sm text-gray-600">AI Wins</div>
          </div>
          <div class="bg-yellow-50 p-3 rounded">
            <div class="text-2xl font-bold text-yellow-600">{{ game.stats.value.ties }}</div>
            <div class="text-sm text-gray-600">Ties</div>
          </div>
        </div>
      </div>

      <!-- Technical Information -->
      <div class="mt-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Composable Architecture</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 class="font-semibold text-gray-700 mb-2">✅ Composables Created:</h3>
            <ul class="text-gray-600">
              <li class="mb-1">• useGameState.ts - Core game logic</li>
              <li class="mb-1">• useGameMode.ts - Mode management</li>
              <li>• useGame.ts - Main controller</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 mb-2">✅ Features:</h3>
            <ul class="text-gray-600">
              <li class="mb-1">• Reactive state management</li>
              <li class="mb-1">• Type-safe composables</li>
              <li class="mb-1">• Game statistics tracking</li>
              <li>• Move history & validation</li>
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