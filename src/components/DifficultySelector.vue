<script setup lang="ts">
// DifficultySelector component for choosing AI difficulty and game mode

export type GameMode = 'human-vs-human' | 'human-vs-ai'
export type AIDifficulty = 'easy' | 'medium' | 'hard'

interface Props {
  gameMode?: GameMode
  aiDifficulty?: AIDifficulty
  aiPlayer?: 'X' | 'O'
  disabled?: boolean
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  gameMode: 'human-vs-human',
  aiDifficulty: 'easy',
  aiPlayer: 'O',
  disabled: false
})

// Events this component can emit
const emit = defineEmits<{
  gameModeChange: [mode: GameMode]
  difficultyChange: [difficulty: AIDifficulty]
  aiPlayerChange: [player: 'X' | 'O']
}>()

// Game mode options
const gameModeOptions = [
  { value: 'human-vs-human', label: 'Human vs Human' },
  { value: 'human-vs-ai', label: 'Human vs AI' }
] as const

// AI difficulty options
const difficultyOptions = [
  { value: 'easy', label: 'Easy', description: 'Random moves' },
  { value: 'medium', label: 'Medium', description: 'Blocks obvious wins' },
  { value: 'hard', label: 'Hard', description: 'Strategic play' }
] as const

// Handle game mode change
const handleGameModeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('gameModeChange', target.value as GameMode)
}

// Handle difficulty change
const handleDifficultyChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('difficultyChange', target.value as AIDifficulty)
}

// Handle AI player change
const handleAIPlayerChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('aiPlayerChange', target.value as 'X' | 'O')
}
</script>

<template>
  <div class="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
    <h3 class="text-lg font-bold text-gray-800 mb-4 text-center">
      Game Settings
    </h3>

    <!-- Game Mode Selection -->
    <div class="mb-4">
      <label for="game-mode" class="block text-sm font-medium text-gray-700 mb-2">
        Game Mode
      </label>
      <select
        id="game-mode"
        :value="props.gameMode"
        :disabled="props.disabled"
        @change="handleGameModeChange"
        class="high-contrast-select w-full p-3 text-gray-900 bg-white border-2 border-gray-400 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
      >
        <option
          v-for="option in gameModeOptions"
          :key="option.value"
          :value="option.value"
          class="text-gray-900 bg-white p-2"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- AI Settings (only show when playing against AI) -->
    <div v-if="props.gameMode === 'human-vs-ai'" class="mb-4 space-y-4">
      <div>
        <label for="ai-difficulty" class="block text-sm font-medium text-gray-700 mb-2">
          AI Difficulty
        </label>
        <select
          id="ai-difficulty"
          :value="props.aiDifficulty"
          :disabled="props.disabled"
          @change="handleDifficultyChange"
          class="high-contrast-select w-full p-3 text-gray-900 bg-white border-2 border-gray-400 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
        >
          <option
            v-for="option in difficultyOptions"
            :key="option.value"
            :value="option.value"
            class="text-gray-900 bg-white p-2"
          >
            {{ option.label }} - {{ option.description }}
          </option>
        </select>
      </div>

      <div>
        <label for="ai-player" class="block text-sm font-medium text-gray-700 mb-2">
          AI Plays As
        </label>
        <select
          id="ai-player"
          :value="props.aiPlayer"
          :disabled="props.disabled"
          @change="handleAIPlayerChange"
          class="high-contrast-select w-full p-3 text-gray-900 bg-white border-2 border-gray-400 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
        >
          <option value="X" class="text-gray-900 bg-white p-2">X (goes first)</option>
          <option value="O" class="text-gray-900 bg-white p-2">O (goes second)</option>
        </select>
      </div>
    </div>

    <!-- Current Settings Display -->
    <div class="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
      <p><strong>Current Mode:</strong> {{ gameModeOptions.find(opt => opt.value === props.gameMode)?.label }}</p>
      <p v-if="props.gameMode === 'human-vs-ai'">
        <strong>AI Difficulty:</strong> {{ difficultyOptions.find(opt => opt.value === props.aiDifficulty)?.label }}
      </p>
      <p v-if="props.gameMode === 'human-vs-ai'">
        <strong>AI Player:</strong> {{ props.aiPlayer }} ({{ props.aiPlayer === 'X' ? 'goes first' : 'goes second' }})
      </p>
    </div>
  </div>
</template>

<style scoped>
/* High contrast select styling */
.high-contrast-select {
  background-image: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6,9 12,15 18,9'></polyline></svg>");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.high-contrast-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Ensure high contrast for option elements */
.high-contrast-select option {
  color: #111827 !important;
  background-color: #ffffff !important;
  padding: 8px !important;
}

.high-contrast-select option:checked {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
}

.high-contrast-select option:hover {
  background-color: #f3f4f6 !important;
  color: #111827 !important;
}

/* Disabled state */
.high-contrast-select:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.high-contrast-select:disabled option {
  color: #6b7280 !important;
  background-color: #f9fafb !important;
}
</style>