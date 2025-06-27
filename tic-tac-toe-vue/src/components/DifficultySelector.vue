<script setup lang="ts">
// Enhanced DifficultySelector component for choosing AI difficulty and game mode

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
  disabled: false,
})

// Events this component can emit
const emit = defineEmits<{
  gameModeChange: [mode: GameMode]
  difficultyChange: [difficulty: AIDifficulty]
  aiPlayerChange: [player: 'X' | 'O']
}>()

// Game mode options with enhanced descriptions
const gameModeOptions = [
  {
    value: 'human-vs-human',
    label: 'Human vs Human',
    description: 'Two players take turns',
    icon: '👥'
  },
  {
    value: 'human-vs-ai',
    label: 'Human vs AI',
    description: 'Play against computer',
    icon: '🤖'
  },
] as const

// AI difficulty options with enhanced descriptions
const difficultyOptions = [
  {
    value: 'easy',
    label: 'Easy',
    description: 'Random moves with occasional strategy',
    winRate: '~30%',
    color: 'green',
    icon: '😊'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Smart tactical play with forks',
    winRate: '~70%',
    color: 'yellow',
    icon: '🤔'
  },
  {
    value: 'hard',
    label: 'Hard',
    description: 'Perfect minimax algorithm',
    winRate: '~95%',
    color: 'red',
    icon: '🔥'
  },
] as const

// AI player options
const aiPlayerOptions = [
  { value: 'X', label: 'X (First)', description: 'AI goes first' },
  { value: 'O', label: 'O (Second)', description: 'Human goes first' },
] as const

// Handle game mode change
const handleGameModeChange = (mode: GameMode) => {
  emit('gameModeChange', mode)
}

// Handle difficulty change
const handleDifficultyChange = (difficulty: AIDifficulty) => {
  emit('difficultyChange', difficulty)
}

// Handle AI player change
const handleAIPlayerChange = (player: 'X' | 'O') => {
  emit('aiPlayerChange', player)
}

// Get current difficulty details
const currentDifficulty = difficultyOptions.find(opt => opt.value === props.aiDifficulty)
</script>

<template>
  <div class="w-full max-w-xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200">
    <h3 class="text-xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
      ⚙️ Game Settings
    </h3>

    <!-- Game Mode Selection -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-3">
        🎮 Game Mode
      </label>
      <div class="grid grid-cols-1 gap-3">
        <div
          v-for="option in gameModeOptions"
          :key="option.value"
          :class="[
            'p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105',
            {
              'border-indigo-500 bg-indigo-50 shadow-md': props.gameMode === option.value,
              'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm': props.gameMode !== option.value,
              'opacity-50 cursor-not-allowed': props.disabled
            }
          ]"
          @click="!props.disabled && handleGameModeChange(option.value)"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ option.icon }}</span>
            <div class="flex-1">
              <div class="font-semibold text-gray-800">{{ option.label }}</div>
              <div class="text-sm text-gray-600">{{ option.description }}</div>
            </div>
            <div
              :class="[
                'w-4 h-4 rounded-full border-2 transition-all duration-200',
                {
                  'bg-indigo-500 border-indigo-500': props.gameMode === option.value,
                  'border-gray-300': props.gameMode !== option.value
                }
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- AI Settings (only show when playing against AI) -->
    <div v-if="props.gameMode === 'human-vs-ai'" class="space-y-6 animate-fade-in">
      <!-- AI Difficulty Selection -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-3">
          🧠 AI Difficulty
        </label>
        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="option in difficultyOptions"
            :key="option.value"
            :class="[
              'p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105',
              {
                [`border-${option.color}-500 bg-${option.color}-50 shadow-md`]: props.aiDifficulty === option.value,
                'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm': props.aiDifficulty !== option.value,
                'opacity-50 cursor-not-allowed': props.disabled
              }
            ]"
            @click="!props.disabled && handleDifficultyChange(option.value)"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ option.icon }}</span>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-gray-800">{{ option.label }}</span>
                  <span
                    :class="[
                      'text-xs px-2 py-1 rounded-full font-medium',
                      {
                        'bg-green-100 text-green-700': option.color === 'green',
                        'bg-yellow-100 text-yellow-700': option.color === 'yellow',
                        'bg-red-100 text-red-700': option.color === 'red'
                      }
                    ]"
                  >
                    {{ option.winRate }}
                  </span>
                </div>
                <div class="text-sm text-gray-600">{{ option.description }}</div>
              </div>
              <div
                :class="[
                  'w-4 h-4 rounded-full border-2 transition-all duration-200',
                  {
                    [`bg-${option.color}-500 border-${option.color}-500`]: props.aiDifficulty === option.value,
                    'border-gray-300': props.aiDifficulty !== option.value
                  }
                ]"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- AI Player Selection -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-3">
          🎯 AI Player
        </label>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="option in aiPlayerOptions"
            :key="option.value"
            :class="[
              'p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 text-center',
              {
                'border-indigo-500 bg-indigo-50 shadow-md': props.aiPlayer === option.value,
                'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm': props.aiPlayer !== option.value,
                'opacity-50 cursor-not-allowed': props.disabled
              }
            ]"
            @click="!props.disabled && handleAIPlayerChange(option.value)"
          >
            <div class="text-3xl font-bold mb-2" :class="{
              'text-blue-600': option.value === 'X',
              'text-red-600': option.value === 'O'
            }">
              {{ option.value }}
            </div>
            <div class="font-semibold text-gray-800 text-sm">{{ option.label }}</div>
            <div class="text-xs text-gray-600">{{ option.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Settings Display -->
    <div class="mt-6 p-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl border border-gray-200">
      <h4 class="font-semibold text-gray-700 mb-2 flex items-center gap-2">
        📋 Current Configuration
      </h4>
      <div class="text-sm space-y-1">
        <div class="flex justify-between">
          <span class="text-gray-600">Mode:</span>
          <span class="font-medium text-gray-800">
            {{ gameModeOptions.find(opt => opt.value === props.gameMode)?.label }}
          </span>
        </div>
        <div v-if="props.gameMode === 'human-vs-ai'" class="flex justify-between">
          <span class="text-gray-600">AI Difficulty:</span>
          <span class="font-medium text-gray-800 flex items-center gap-1">
            {{ currentDifficulty?.icon }}
            {{ currentDifficulty?.label }}
          </span>
        </div>
        <div v-if="props.gameMode === 'human-vs-ai'" class="flex justify-between">
          <span class="text-gray-600">AI Player:</span>
          <span class="font-medium text-gray-800">{{ props.aiPlayer }}</span>
        </div>
      </div>
    </div>

    <!-- Difficulty Preview -->
    <div v-if="props.gameMode === 'human-vs-ai' && currentDifficulty" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
      <div class="flex items-start gap-3">
        <span class="text-xl">💡</span>
        <div>
          <div class="font-medium text-blue-800 text-sm">{{ currentDifficulty.label }} AI Strategy</div>
          <div class="text-blue-700 text-xs">{{ currentDifficulty.description }}</div>
          <div class="text-blue-600 text-xs mt-1">Win rate against average players: {{ currentDifficulty.winRate }}</div>
        </div>
      </div>
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

/* Enhanced hover effects */
.hover\:scale-105:hover {
  transform: scale(1.02);
}

/* Color-safe approach for dynamic classes */
.border-green-500 { border-color: #10b981; }
.bg-green-50 { background-color: #f0fdf4; }
.bg-green-500 { background-color: #10b981; }

.border-yellow-500 { border-color: #f59e0b; }
.bg-yellow-50 { background-color: #fffbeb; }
.bg-yellow-500 { background-color: #f59e0b; }

.border-red-500 { border-color: #ef4444; }
.bg-red-50 { background-color: #fef2f2; }
.bg-red-500 { background-color: #ef4444; }

/* Disabled state styles */
.opacity-50 {
  opacity: 0.5;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
