import { ref, computed, readonly } from 'vue'
import { GameEngine, createGameEngine } from '../utils/gameEngine'
import type { GameEngineState, MoveResult } from '../utils/gameEngine'
import { validateMove } from '../utils/gameLogic'

export type Player = 'X' | 'O'
export type Cell = Player | ''
export type Board = Cell[]
export type GameStatus = 'playing' | 'won' | 'tie'

export interface GameState {
  board: Board
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  moveCount: number
  winningLine: number[] | null
  moveHistory: string[]
  lastMove: number | null
}

export function useGameState() {
  // Game engine instance
  const gameEngine = ref<GameEngine>(createGameEngine())

  // Reactive state derived from game engine
  const engineState = ref<GameEngineState>(gameEngine.value.getState())

  // Computed properties derived from engine state
  const gameState = computed<GameState>(() => ({
    board: engineState.value.board,
    currentPlayer: engineState.value.currentPlayer,
    status: engineState.value.status,
    winner: engineState.value.winner,
    moveCount: engineState.value.moveCount,
    winningLine: engineState.value.winningLine,
    moveHistory: engineState.value.moveHistory,
    lastMove: engineState.value.lastMove,
  }))

  const board = computed(() => engineState.value.board)
  const currentPlayer = computed(() => engineState.value.currentPlayer)
  const status = computed(() => engineState.value.status)
  const winner = computed(() => engineState.value.winner)
  const moveCount = computed(() => engineState.value.moveCount)
  const winningLine = computed(() => engineState.value.winningLine)
  const moveHistory = computed(() => engineState.value.moveHistory)
  const lastMove = computed(() => engineState.value.lastMove)

  const isGameOver = computed(() => status.value !== 'playing')
  const isBoardFull = computed(() => moveCount.value === 9)

  // Sync engine state with reactive state
  function syncState(): void {
    engineState.value = gameEngine.value.getState()
  }

  // Enhanced move function with better error handling
  function makeMove(index: number): boolean {
    const result: MoveResult = gameEngine.value.makeMove(index)

    if (result.success) {
      syncState()
      return true
    } else {
      console.warn('Invalid move:', result.error)
      return false
    }
  }

  // Enhanced reset function
  function resetGame(startingPlayer: Player = 'X'): void {
    gameEngine.value.reset(startingPlayer)
    syncState()
  }

  // Enhanced move validation
  function isValidMove(index: number): boolean {
    return gameEngine.value.isValidMove(index)
  }

  // Get available moves from engine
  function getAvailableMoves(): number[] {
    return gameEngine.value.getAvailableMoves()
  }

  // Legacy checkWinner function for compatibility
  function checkWinner(board: Board): { winner: Player | null; line: number[] | null } {
    // Create a temporary engine to evaluate the board
    const tempEngine = createGameEngine()
    tempEngine.loadState({
      board,
      moveCount: board.filter((cell) => cell !== '').length,
    })

    const state = tempEngine.getState()
    return {
      winner: state.winner,
      line: state.winningLine,
    }
  }

  // New utility functions enabled by the engine
  function undoLastMove(): boolean {
    const result = gameEngine.value.undoLastMove()
    if (result.success) {
      syncState()
      return true
    }
    return false
  }

  function getGameSummary() {
    return gameEngine.value.getGameSummary()
  }

  function exportGameState(): string {
    return gameEngine.value.exportState()
  }

  function importGameState(stateString: string): boolean {
    const newEngine = GameEngine.fromExportedState(stateString)
    if (newEngine) {
      gameEngine.value = newEngine
      syncState()
      return true
    }
    return false
  }

  // Get move description for the last move
  function getLastMoveDescription(): string | null {
    const history = moveHistory.value
    return history.length > 0 ? history[history.length - 1] : null
  }

  // Check if we can undo
  function canUndo(): boolean {
    return moveCount.value > 0
  }

  // Get detailed move validation info
  function getMoveValidation(index: number): { isValid: boolean; reason?: string } {
    const validation = validateMove(board.value, index, isGameOver.value)
    return validation
  }

  // Advanced game state queries
  function getPlayerMoveCount(player: Player): number {
    return board.value.filter((cell) => cell === player).length
  }

  function getTurnNumber(): number {
    return Math.floor(moveCount.value / 2) + 1
  }

  function isPlayerTurn(player: Player): boolean {
    return currentPlayer.value === player && !isGameOver.value
  }

  return {
    // Readonly state
    gameState: readonly(gameState),
    board: readonly(board),
    currentPlayer: readonly(currentPlayer),
    status: readonly(status),
    winner: readonly(winner),
    moveCount: readonly(moveCount),
    winningLine: readonly(winningLine),
    moveHistory: readonly(moveHistory),
    lastMove: readonly(lastMove),
    isGameOver: readonly(isGameOver),
    isBoardFull: readonly(isBoardFull),

    // Core actions
    makeMove,
    resetGame,
    isValidMove,
    getAvailableMoves,
    checkWinner,

    // Enhanced actions
    undoLastMove,
    canUndo,
    getGameSummary,
    exportGameState,
    importGameState,
    getLastMoveDescription,
    getMoveValidation,

    // Advanced queries
    getPlayerMoveCount,
    getTurnNumber,
    isPlayerTurn,

    // Engine access (for advanced use cases)
    getEngine: () => gameEngine.value,
  }
}
