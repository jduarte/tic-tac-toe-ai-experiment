import type { Player, Board, GameStatus } from '../composables/useGameState'
import type { GameMode, AIDifficulty } from '../composables/useGameMode'
import {
  validateMove,
  evaluateGameState,
  applyMove,
  getNextPlayer,
  createEmptyBoard,
  getMoveDescription,
  validateBoardState,
  cloneBoard,
} from './gameLogic'

// Game engine state
export interface GameEngineState {
  board: Board
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  moveCount: number
  winningLine: number[] | null
  moveHistory: string[]
  lastMove: number | null
}

// Move result
export interface MoveResult {
  success: boolean
  newState?: GameEngineState
  error?: string
  moveDescription?: string
}

// Game engine class for managing game flow
export class GameEngine {
  private state: GameEngineState

  constructor(initialState?: Partial<GameEngineState>) {
    this.state = {
      board: createEmptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      moveCount: 0,
      winningLine: null,
      moveHistory: [],
      lastMove: null,
      ...initialState,
    }

    // Validate initial state
    this.validateState()
  }

  /**
   * Get current game state (readonly copy)
   */
  getState(): Readonly<GameEngineState> {
    return {
      ...this.state,
      board: cloneBoard(this.state.board),
      moveHistory: [...this.state.moveHistory],
    }
  }

  /**
   * Make a move
   */
  makeMove(index: number): MoveResult {
    try {
      // Validate the move
      const validation = validateMove(this.state.board, index, this.state.status !== 'playing')
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.reason,
        }
      }

      // Apply the move
      const newBoard = applyMove(this.state.board, index, this.state.currentPlayer)
      const newMoveCount = this.state.moveCount + 1

      // Evaluate new game state
      const gameResult = evaluateGameState(newBoard, newMoveCount)

      // Create move description
      const moveDescription = getMoveDescription(index, this.state.currentPlayer)

      // Update state
      this.state = {
        ...this.state,
        board: newBoard,
        currentPlayer: gameResult.isGameOver
          ? this.state.currentPlayer
          : getNextPlayer(this.state.currentPlayer),
        status: gameResult.isGameOver ? (gameResult.isDraw ? 'tie' : 'won') : 'playing',
        winner: gameResult.winner,
        moveCount: newMoveCount,
        winningLine: gameResult.winningLine,
        moveHistory: [...this.state.moveHistory, moveDescription],
        lastMove: index,
      }

      return {
        success: true,
        newState: this.getState(),
        moveDescription,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Reset the game
   */
  reset(startingPlayer: Player = 'X'): void {
    this.state = {
      board: createEmptyBoard(),
      currentPlayer: startingPlayer,
      status: 'playing',
      winner: null,
      moveCount: 0,
      winningLine: null,
      moveHistory: [],
      lastMove: null,
    }
  }

  /**
   * Undo the last move
   */
  undoLastMove(): MoveResult {
    if (this.state.moveCount === 0) {
      return {
        success: false,
        error: 'No moves to undo',
      }
    }

    // This is a simplified undo - in a real implementation,
    // you might want to store previous states
    const lastMoveIndex = this.state.lastMove
    if (lastMoveIndex === null) {
      return {
        success: false,
        error: 'Cannot determine last move',
      }
    }

    // Remove the last move from board
    const newBoard = cloneBoard(this.state.board)
    newBoard[lastMoveIndex] = ''

    // Update state
    this.state = {
      ...this.state,
      board: newBoard,
      currentPlayer: getNextPlayer(this.state.currentPlayer),
      status: 'playing',
      winner: null,
      moveCount: this.state.moveCount - 1,
      winningLine: null,
      moveHistory: this.state.moveHistory.slice(0, -1),
      lastMove: null, // Would need better tracking for multiple undos
    }

    return {
      success: true,
      newState: this.getState(),
    }
  }

  /**
   * Check if a move is valid
   */
  isValidMove(index: number): boolean {
    const validation = validateMove(this.state.board, index, this.state.status !== 'playing')
    return validation.isValid
  }

  /**
   * Get available moves
   */
  getAvailableMoves(): number[] {
    return this.state.board
      .map((cell, index) => (cell === '' ? index : -1))
      .filter((index) => index !== -1)
  }

  /**
   * Check if game is over
   */
  isGameOver(): boolean {
    return this.state.status !== 'playing'
  }

  /**
   * Get game result summary
   */
  getGameSummary() {
    return {
      winner: this.state.winner,
      status: this.state.status,
      moveCount: this.state.moveCount,
      moves: this.state.moveHistory.length,
      finalBoard: cloneBoard(this.state.board),
    }
  }

  /**
   * Load state from external source
   */
  loadState(newState: Partial<GameEngineState>): boolean {
    try {
      const mergedState = { ...this.state, ...newState }

      // Validate the new state
      if (mergedState.board) {
        const validation = validateBoardState(mergedState.board)
        if (!validation.isValid) {
          console.error('Invalid board state:', validation.errors)
          return false
        }
      }

      this.state = mergedState
      return true
    } catch (error) {
      console.error('Failed to load state:', error)
      return false
    }
  }

  /**
   * Validate current state
   */
  private validateState(): void {
    const validation = validateBoardState(this.state.board)
    if (!validation.isValid) {
      console.warn('Game engine initialized with invalid state:', validation.errors)
    }
  }

  /**
   * Export state for persistence
   */
  exportState(): string {
    return JSON.stringify(this.getState())
  }

  /**
   * Import state from persistence
   */
  static fromExportedState(exportedState: string): GameEngine | null {
    try {
      const state = JSON.parse(exportedState) as GameEngineState
      return new GameEngine(state)
    } catch (error) {
      console.error('Failed to import game state:', error)
      return null
    }
  }
}

// Factory function for creating game engines
export function createGameEngine(config?: {
  startingPlayer?: Player
  gameMode?: GameMode
  difficulty?: AIDifficulty
}): GameEngine {
  return new GameEngine({
    currentPlayer: config?.startingPlayer || 'X',
  })
}

// Utility function for simulating games (useful for AI training/testing)
export function simulateRandomGame(): GameEngine {
  const engine = createGameEngine()

  while (!engine.isGameOver()) {
    const availableMoves = engine.getAvailableMoves()
    if (availableMoves.length === 0) break

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
    engine.makeMove(randomMove)
  }

  return engine
}
