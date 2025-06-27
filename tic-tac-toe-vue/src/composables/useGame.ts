import { ref, computed, watch, nextTick } from 'vue'
import { useGameState } from './useGameState'
import { useGameMode } from './useGameMode'
import type { GameMode, AIDifficulty } from './useGameMode'
import { aiManager } from '../ai/aiManager'
import type { AIMoveResult } from '../ai/aiManager'

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

  // AI state
  const isAIThinking = ref(false)
  const lastAIMove = ref<AIMoveResult | null>(null)

  // Computed properties
  const canMakeMove = computed(
    () =>
      !gameState.isGameOver.value &&
      !isProcessingMove.value &&
      !isAIThinking.value &&
      (!gameMode.isAIEnabled.value || !gameMode.isAITurn(gameState.currentPlayer.value)),
  )

  const currentPlayerDisplay = computed(() => {
    if (gameState.isGameOver.value) return ''

    if (isAIThinking.value) return 'AI is thinking...'

    if (gameMode.isAIEnabled.value) {
      const isAITurn = gameMode.isAITurn(gameState.currentPlayer.value)
      if (isAITurn) {
        return `AI (${gameState.currentPlayer.value})`
      } else {
        return `Human (${gameState.currentPlayer.value})`
      }
    }

    return `Player ${gameState.currentPlayer.value}`
  })

  const shouldTriggerAI = computed(
    () =>
      gameMode.isAIEnabled.value &&
      gameMode.isAITurn(gameState.currentPlayer.value) &&
      !gameState.isGameOver.value &&
      !isProcessingMove.value &&
      !isAIThinking.value,
  )

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

  // AI move function
  async function makeAIMove(): Promise<boolean> {
    if (!gameMode.isAIEnabled.value || !shouldTriggerAI.value) {
      return false
    }

    isAIThinking.value = true

    try {
      const aiMoveResult = await aiManager.makeAIMove(
        [...gameState.board.value],
        gameState.currentPlayer.value,
      )
      lastAIMove.value = aiMoveResult

      const success = gameState.makeMove(aiMoveResult.move)

      if (success) {
        // Add AI move to history with reasoning
        const move = `AI-${gameState.currentPlayer.value === 'X' ? 'O' : 'X'}:${aiMoveResult.move} (${aiMoveResult.reasoning})`
        gameHistory.value.push(move)

        // If game is over, update stats
        if (gameState.isGameOver.value) {
          updateStats()
        }
      }

      return success
    } catch (error) {
      console.error('AI move failed:', error)
      return false
    } finally {
      isAIThinking.value = false
    }
  }

  function newGame(): void {
    gameState.resetGame()
    gameHistory.value = []
    isProcessingMove.value = false
    isAIThinking.value = false
    lastAIMove.value = null
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

  // Initialize AI when game mode changes
  watch(
    [
      () => gameMode.gameMode.value,
      () => gameMode.aiDifficulty.value,
      () => gameMode.aiPlayer.value,
    ],
    () => {
      if (gameMode.isAIEnabled.value) {
        aiManager.setAI(gameMode.aiDifficulty.value, gameMode.aiPlayer.value)
      }
    },
    { immediate: true },
  )

  // Watch for AI turns and trigger AI moves
  watch(shouldTriggerAI, (should) => {
    if (should) {
      nextTick(() => {
        makeAIMove()
      })
    }
  })

  return {
    // Game state (readonly)
    ...gameState,

    // Game mode state (readonly)
    ...gameMode,

    // Additional state
    isProcessingMove: computed(() => isProcessingMove.value),
    isAIThinking: computed(() => isAIThinking.value),
    gameHistory: computed(() => [...gameHistory.value]),
    stats: computed(() => ({ ...stats.value })),
    lastAIMove: computed(() => lastAIMove.value),
    canMakeMove,
    currentPlayerDisplay,
    shouldTriggerAI,

    // Actions
    makeMove,
    makeAIMove,
    newGame,
    changeGameMode,
    changeAIDifficulty,
    changeAIPlayer,
    getMoveHistory,
    getGameSummary,
    resetStats,

    // AI utilities
    getAIName: () => aiManager.getAIName(),
    getAIDescription: () => aiManager.getAIDescription(),
  }
}
