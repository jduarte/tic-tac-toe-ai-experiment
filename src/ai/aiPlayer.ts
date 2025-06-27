import type { Player, Board } from '../composables/useGameState'
import type { AIDifficulty } from '../composables/useGameMode'

// AI move result interface
export interface AIMoveResult {
  move: number
  confidence: number // 0-1, how confident the AI is in this move
  reasoning: string
  evaluationTime: number // in milliseconds
}

// AI player interface
export interface AIPlayer {
  readonly difficulty: AIDifficulty
  readonly player: Player

  // Make a move given the current board state
  makeMove(board: Board, player: Player): Promise<AIMoveResult>

  // Evaluate a position (optional, for analysis)
  evaluatePosition?(board: Board, player: Player): number

  // Get name/description of this AI
  getName(): string
  getDescription(): string
}

// Base AI player class
export abstract class BaseAIPlayer implements AIPlayer {
  constructor(
    public readonly difficulty: AIDifficulty,
    public readonly player: Player,
  ) {}

  abstract makeMove(board: Board, player: Player): Promise<AIMoveResult>

  abstract getName(): string
  abstract getDescription(): string

  // Utility method to get available moves
  protected getAvailableMoves(board: Board): number[] {
    return board.map((cell, index) => (cell === '' ? index : -1)).filter((index) => index !== -1)
  }

  // Utility method to simulate a move
  protected simulateMove(board: Board, index: number, player: Player): Board {
    const newBoard = [...board]
    newBoard[index] = player
    return newBoard
  }

  // Utility method to get opponent
  protected getOpponent(player: Player): Player {
    return player === 'X' ? 'O' : 'X'
  }

  // Add delay to simulate thinking (for better UX)
  protected async addThinkingDelay(minMs: number = 300, maxMs: number = 1500): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs
    return new Promise((resolve) => setTimeout(resolve, delay))
  }
}

// AI move evaluation utilities
export class AIMoveEvaluator {
  // Check if a move results in a win
  static isWinningMove(board: Board, index: number, player: Player): boolean {
    const testBoard = [...board]
    testBoard[index] = player
    return this.checkWinner(testBoard) === player
  }

  // Check if a move blocks opponent win
  static isBlockingMove(board: Board, index: number, player: Player): boolean {
    const opponent = player === 'X' ? 'O' : 'X'
    const testBoard = [...board]
    testBoard[index] = opponent
    return this.checkWinner(testBoard) === opponent
  }

  // Check for winner on a board
  static checkWinner(board: Board): Player | null {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ]

    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player
      }
    }
    return null
  }

  // Evaluate board position for a player (-10 to +10)
  static evaluateBoard(board: Board, player: Player): number {
    const winner = this.checkWinner(board)

    if (winner === player) return 10
    if (winner === this.getOpponent(player)) return -10

    // Position-based evaluation
    let score = 0

    // Center control is valuable
    if (board[4] === player) score += 3
    else if (board[4] === this.getOpponent(player)) score -= 3

    // Corner control
    const corners = [0, 2, 6, 8]
    for (const corner of corners) {
      if (board[corner] === player) score += 2
      else if (board[corner] === this.getOpponent(player)) score -= 2
    }

    // Edge control (less valuable)
    const edges = [1, 3, 5, 7]
    for (const edge of edges) {
      if (board[edge] === player) score += 1
      else if (board[edge] === this.getOpponent(player)) score -= 1
    }

    return score
  }

  // Get strategic move priorities
  static getStrategicPriorities(board: Board): {
    center: number | null
    corners: number[]
    edges: number[]
  } {
    return {
      center: board[4] === '' ? 4 : null,
      corners: [0, 2, 6, 8].filter((pos) => board[pos] === ''),
      edges: [1, 3, 5, 7].filter((pos) => board[pos] === ''),
    }
  }

  private static getOpponent(player: Player): Player {
    return player === 'X' ? 'O' : 'X'
  }
}
