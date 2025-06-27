<script setup lang="ts">
import { useGame } from './composables/useGame'
import GameBoard from './components/GameBoard.vue'
import GameStatus from './components/GameStatus.vue'
import DifficultySelector from './components/DifficultySelector.vue'

const game = useGame()

function handleCellClick(index: number) {
  console.log('🔲 Cell clicked! Index:', index)
  console.log('🔍 Before move - Board:', game.board.value)
  console.log('🔍 Can make move?', game.canMakeMove.value)

  const result = game.makeMove(index)

  console.log('📝 Move result:', result)
  console.log('✅ After move - Board:', game.board.value)
}

function handleNewGame() {
  console.log('🎮 New Game button clicked!')
  console.log('🔍 Before newGame() - Current board:', game.board.value)
  console.log('🔍 Before newGame() - Move count:', game.moveCount.value)
  console.log('🔍 Before newGame() - Board length:', game.board.value?.length)
  console.log('🔍 Before newGame() - Board type:', typeof game.board.value)

  game.newGame()

  console.log('✅ After newGame() - Current board:', game.board.value)
  console.log('✅ After newGame() - Move count:', game.moveCount.value)
  console.log('✅ After newGame() - Current player:', game.currentPlayer.value)
  console.log('✅ After newGame() - Board length:', game.board.value?.length)
  console.log('✅ After newGame() - Board type:', typeof game.board.value)
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
          🎮 Vue.js Tic Tac Toe
        </h1>
        <p class="text-gray-600">
          Play against AI with three difficulty levels
        </p>
        <p class="text-sm text-indigo-600 font-medium mt-2">
          Built with Vue 3, TypeScript & Tailwind CSS
        </p>
      </div>

      <!-- Main Game Layout -->
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Left Column: Game Controls -->
        <div class="flex flex-col gap-6 order-2 lg:order-1">
          <!-- Game Mode & Difficulty Selector -->
          <DifficultySelector
            :game-mode="game.gameMode.value"
            :ai-difficulty="game.aiDifficulty.value"
            :ai-player="game.aiPlayer.value"
            @game-mode-change="handleModeChange"
            @difficulty-change="handleDifficultyChange"
            @ai-player-change="handleAIPlayerChange"
          />

          <!-- Game Status & Controls -->
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

          <!-- AI Information -->
          <div
            v-if="game.isAIEnabled.value"
            class="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 class="text-lg font-bold text-gray-800 mb-3">🤖 AI Information</h3>
            <div class="space-y-2 text-sm">
              <p><strong>AI Name:</strong> {{ game.getAIName() }}</p>
              <p><strong>Description:</strong> {{ game.getAIDescription() }}</p>
              <p v-if="game.lastAIMove.value" class="text-gray-600">
                <strong>Last AI Move:</strong> {{ game.lastAIMove.value.reasoning }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column: Game Board -->
        <div class="flex items-center justify-center order-1 lg:order-2">
          <GameBoard
            :board="game.board.value"
            :winning-line="game.winningLine.value"
            :can-make-move="game.canMakeMove.value"
            :is-processing="game.isProcessingMove.value"
            @cell-click="handleCellClick"
          />
        </div>
      </div>

      <!-- Game Statistics -->
      <div
        v-if="game.stats.value.gamesPlayed > 0"
        class="mt-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6"
      >
        <h2 class="text-xl font-bold text-gray-800 mb-4 text-center">📊 Game Statistics</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-3xl font-bold text-blue-600">{{ game.stats.value.gamesPlayed }}</div>
            <div class="text-sm text-gray-600 font-medium">Total Games</div>
          </div>
          <div
            v-if="game.isAIEnabled.value"
            class="bg-green-50 p-4 rounded-lg border border-green-200"
          >
            <div class="text-3xl font-bold text-green-600">{{ game.stats.value.humanWins }}</div>
            <div class="text-sm text-gray-600 font-medium">Human Wins</div>
          </div>
          <div
            v-if="game.isAIEnabled.value"
            class="bg-red-50 p-4 rounded-lg border border-red-200"
          >
            <div class="text-3xl font-bold text-red-600">{{ game.stats.value.aiWins }}</div>
            <div class="text-sm text-gray-600 font-medium">AI Wins</div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div class="text-3xl font-bold text-yellow-600">{{ game.stats.value.ties }}</div>
            <div class="text-sm text-gray-600 font-medium">Ties</div>
          </div>
        </div>

        <!-- Win Rate Display -->
        <div
          v-if="game.isAIEnabled.value && game.stats.value.gamesPlayed > 0"
          class="mt-4 text-center"
        >
          <div class="text-lg font-semibold text-gray-700">
            Your Win Rate:
            <span
              class="font-bold"
              :class="{
                'text-green-600': (game.stats.value.humanWins / game.stats.value.gamesPlayed) > 0.5,
                'text-yellow-600': (game.stats.value.humanWins / game.stats.value.gamesPlayed) === 0.5,
                'text-red-600': (game.stats.value.humanWins / game.stats.value.gamesPlayed) < 0.5
              }"
            >
              {{ Math.round((game.stats.value.humanWins / game.stats.value.gamesPlayed) * 100) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Features Information -->
      <div class="mt-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 text-center">✨ Game Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div class="text-center">
            <div class="text-2xl mb-2">🎯</div>
            <h3 class="font-semibold text-gray-700 mb-2">Smart AI Opponents</h3>
            <p class="text-gray-600">Three difficulty levels from beginner to unbeatable</p>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-2">🎨</div>
            <h3 class="font-semibold text-gray-700 mb-2">Modern UI</h3>
            <p class="text-gray-600">Beautiful animations and responsive design</p>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-2">📊</div>
            <h3 class="font-semibold text-gray-700 mb-2">Game Statistics</h3>
            <p class="text-gray-600">Track your performance and win rates</p>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-2">⚡</div>
            <h3 class="font-semibold text-gray-700 mb-2">Fast & Responsive</h3>
            <p class="text-gray-600">Built with Vue 3 Composition API</p>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-2">🔧</div>
            <h3 class="font-semibold text-gray-700 mb-2">TypeScript</h3>
            <p class="text-gray-600">Type-safe development experience</p>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-2">🎮</div>
            <h3 class="font-semibold text-gray-700 mb-2">Multiple Game Modes</h3>
            <p class="text-gray-600">Human vs Human or Human vs AI</p>
          </div>
        </div>
      </div>

      <!-- Debug Information (Development Only) -->
      <div
        v-if="true"
        class="mt-8 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg p-4 text-xs"
      >
        <h3 class="font-bold text-gray-700 mb-2">🔧 Debug Information</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Board:</strong> {{ JSON.stringify(game.board.value) }}</p>
            <p><strong>Current Player:</strong> {{ game.currentPlayer.value }}</p>
            <p><strong>Winner:</strong> {{ game.winner.value || 'None' }}</p>
            <p><strong>Status:</strong> {{ game.status.value }}</p>
          </div>
          <div>
            <p><strong>Move Count:</strong> {{ game.moveCount.value }}</p>
            <p><strong>Game Mode:</strong> {{ game.gameMode.value }}</p>
            <p><strong>AI Difficulty:</strong> {{ game.aiDifficulty.value }}</p>
            <p><strong>Can Make Move:</strong> {{ game.canMakeMove.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional component-specific styles if needed */
</style>