import { ref, computed, readonly } from 'vue'

export type GameMode = 'human-vs-human' | 'human-vs-ai'
export type AIDifficulty = 'easy' | 'medium' | 'hard'

export interface GameModeState {
  gameMode: GameMode
  aiDifficulty: AIDifficulty
  isAIEnabled: boolean
  isAITurn: boolean
  aiPlayer: 'X' | 'O'
  humanPlayer: 'X' | 'O'
}

export function useGameMode() {
  // Reactive state
  const gameMode = ref<GameMode>('human-vs-human')
  const aiDifficulty = ref<AIDifficulty>('easy')
  const aiPlayer = ref<'X' | 'O'>('O')

  // Computed properties
  const humanPlayer = computed<'X' | 'O'>(() => (aiPlayer.value === 'X' ? 'O' : 'X'))
  const isAIEnabled = computed(() => gameMode.value === 'human-vs-ai')

  const gameModeState = computed<GameModeState>(() => ({
    gameMode: gameMode.value,
    aiDifficulty: aiDifficulty.value,
    isAIEnabled: isAIEnabled.value,
    isAITurn: false, // This will be determined by current player
    aiPlayer: aiPlayer.value,
    humanPlayer: humanPlayer.value,
  }))

  // Game mode functions
  function setGameMode(mode: GameMode): void {
    gameMode.value = mode
  }

  function setAIDifficulty(difficulty: AIDifficulty): void {
    aiDifficulty.value = difficulty
  }

  function setAIPlayer(player: 'X' | 'O'): void {
    aiPlayer.value = player
  }

  function isAITurn(currentPlayer: 'X' | 'O'): boolean {
    return isAIEnabled.value && currentPlayer === aiPlayer.value
  }

  function getGameModeDisplay(): string {
    if (gameMode.value === 'human-vs-human') {
      return 'Human vs Human'
    }
    return `Human vs AI (${aiDifficulty.value})`
  }

  function resetGameMode(): void {
    gameMode.value = 'human-vs-human'
    aiDifficulty.value = 'easy'
    aiPlayer.value = 'O'
  }

  return {
    // Readonly state
    gameModeState: readonly(gameModeState),
    gameMode: readonly(gameMode),
    aiDifficulty: readonly(aiDifficulty),
    aiPlayer: readonly(aiPlayer),
    humanPlayer: readonly(humanPlayer),
    isAIEnabled: readonly(isAIEnabled),

    // Actions
    setGameMode,
    setAIDifficulty,
    setAIPlayer,
    isAITurn,
    getGameModeDisplay,
    resetGameMode,
  }
}
