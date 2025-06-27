import { ref, computed } from 'vue'
import { useGameState } from './useGameState'
import { useGameMode } from './useGameMode'
import type { GameMode, AIDifficulty } from './useGameMode'

export interface GameStats {
  gamesPlayed: number
  humanWins: number
  aiWins: number
  ties: number
}

export function useGame() {
  // Sub-composables
  const gameState = useGameState()
  const gameMode = useGameMode()

  // Additional state
  const isProcessingMove = ref(false)
  const gameHistory = ref<string[]>([])
  const stats = ref<GameStats>({
    gamesPlayed: 0,
    humanWins: 0,
    aiWins: 0,
    ties: 0,
  })

  // Computed properties
  const canMakeMove = computed(() => !gameState.isGameOver.value && !isProcessingMove.value)

  const currentPlayerDisplay = computed(() => {
    if (gameState.isGameOver.value) return ''

    if (gameMode.isAIEnabled.value) {
      return gameMode.isAITurn(gameState.currentPlayer.value) ? 'AI' : 'Human'
    }

    return `Player ${gameState.currentPlayer.value}`
  })

  // Game actions
  async function makeMove(index: number): Promise<boolean> {
    if (!canMakeMove.value || !gameState.isValidMove(index)) {
      return false
    }

    isProcessingMove.value = true

    try {
      const success = gameState.makeMove(index)

      if (success) {
        // Add move to history
        const move = `${gameState.currentPlayer.value === 'X' ? 'O' : 'X'}:${index}`
        gameHistory.value.push(move)

        // If game is over, update stats
        if (gameState.isGameOver.value) {
          updateStats()
        }
      }

      return success
    } finally {
      isProcessingMove.value = false
    }
  }

  function newGame(): void {
    gameState.resetGame()
    gameHistory.value = []
    isProcessingMove.value = false
  }

  function updateStats(): void {
    stats.value.gamesPlayed++

    if (gameState.status.value === 'tie') {
      stats.value.ties++
    } else if (gameState.winner.value) {
      if (gameMode.isAIEnabled.value) {
        if (gameState.winner.value === gameMode.humanPlayer.value) {
          stats.value.humanWins++
        } else {
          stats.value.aiWins++
        }
      }
    }
  }

  // Game mode actions
  function changeGameMode(mode: GameMode): void {
    gameMode.setGameMode(mode)
    newGame() // Reset game when mode changes
  }

  function changeAIDifficulty(difficulty: AIDifficulty): void {
    gameMode.setAIDifficulty(difficulty)
    if (gameMode.isAIEnabled.value && !gameState.isGameOver.value) {
      newGame() // Reset game when difficulty changes mid-game
    }
  }

  function changeAIPlayer(player: 'X' | 'O'): void {
    gameMode.setAIPlayer(player)
    newGame() // Reset game when AI player changes
  }

  // Utility functions
  function getMoveHistory(): string[] {
    return [...gameHistory.value]
  }

  function getGameSummary() {
    return {
      board: [...gameState.board.value],
      winner: gameState.winner.value,
      status: gameState.status.value,
      moveCount: gameState.moveCount.value,
      gameMode: gameMode.gameMode.value,
      aiDifficulty: gameMode.aiDifficulty.value,
      history: getMoveHistory(),
    }
  }

  function resetStats(): void {
    stats.value = {
      gamesPlayed: 0,
      humanWins: 0,
      aiWins: 0,
      ties: 0,
    }
  }

  // Watch for AI turns and trigger AI moves
  const shouldTriggerAI = computed(
    () =>
      gameMode.isAIEnabled.value &&
      gameMode.isAITurn(gameState.currentPlayer.value) &&
      !gameState.isGameOver.value &&
      !isProcessingMove.value,
  )

  return {
    // Game state (readonly)
    ...gameState,

    // Game mode state (readonly)
    ...gameMode,

    // Additional state
    isProcessingMove: computed(() => isProcessingMove.value),
    gameHistory: computed(() => [...gameHistory.value]),
    stats: computed(() => ({ ...stats.value })),
    canMakeMove,
    currentPlayerDisplay,
    shouldTriggerAI,

    // Actions
    makeMove,
    newGame,
    changeGameMode,
    changeAIDifficulty,
    changeAIPlayer,
    getMoveHistory,
    getGameSummary,
    resetStats,
  }
}
