import type { Player, Board } from '../composables/useGameState'

// Winning combinations for tic-tac-toe
export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
] as const

// Game result interface
export interface GameResult {
  winner: Player | null
  winningLine: number[] | null
  isDraw: boolean
  isGameOver: boolean
}

// Move validation result
export interface MoveValidation {
  isValid: boolean
  reason?: string
}

/**
 * Check if a move is valid
 */
export function validateMove(board: Board, index: number, isGameOver: boolean): MoveValidation {
  // Check bounds
  if (index < 0 || index > 8) {
    return { isValid: false, reason: 'Move index out of bounds' }
  }

  // Check if game is over
  if (isGameOver) {
    return { isValid: false, reason: 'Game is already over' }
  }

  // Check if cell is empty
  if (board[index] !== '') {
    return { isValid: false, reason: 'Cell is already occupied' }
  }

  return { isValid: true }
}

/**
 * Check for winner and return game result
 */
export function evaluateGameState(board: Board, moveCount: number): GameResult {
  // Check for winner
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        winningLine: combination.slice(),
        isDraw: false,
        isGameOver: true,
      }
    }
  }

  // Check for draw (board full)
  const isDraw = moveCount === 9

  return {
    winner: null,
    winningLine: null,
    isDraw,
    isGameOver: isDraw,
  }
}

/**
 * Get all available moves
 */
export function getAvailableMoves(board: Board): number[] {
  return board.map((cell, index) => (cell === '' ? index : -1)).filter((index) => index !== -1)
}

/**
 * Apply a move to the board (returns new board)
 */
export function applyMove(board: Board, index: number, player: Player): Board {
  if (board[index] !== '') {
    throw new Error(`Cell ${index} is already occupied`)
  }

  const newBoard = [...board]
  newBoard[index] = player
  return newBoard
}

/**
 * Get the next player
 */
export function getNextPlayer(currentPlayer: Player): Player {
  return currentPlayer === 'X' ? 'O' : 'X'
}

/**
 * Convert board position to row/col
 */
export function indexToPosition(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / 3),
    col: index % 3,
  }
}

/**
 * Convert row/col to board position
 */
export function positionToIndex(row: number, col: number): number {
  return row * 3 + col
}

/**
 * Get opponent player
 */
export function getOpponent(player: Player): Player {
  return player === 'X' ? 'O' : 'X'
}

/**
 * Check if a player can win in one move
 */
export function canWinInOneMove(board: Board, player: Player): number | null {
  const availableMoves = getAvailableMoves(board)

  for (const move of availableMoves) {
    const testBoard = applyMove(board, move, player)
    const result = evaluateGameState(testBoard, board.filter((cell) => cell !== '').length + 1)

    if (result.winner === player) {
      return move
    }
  }

  return null
}

/**
 * Check if opponent can win in one move (for blocking)
 */
export function findBlockingMove(board: Board, player: Player): number | null {
  const opponent = getOpponent(player)
  return canWinInOneMove(board, opponent)
}

/**
 * Get center position if available
 */
export function getCenterMove(board: Board): number | null {
  return board[4] === '' ? 4 : null
}

/**
 * Get corner positions that are available
 */
export function getAvailableCorners(board: Board): number[] {
  const corners = [0, 2, 6, 8]
  return corners.filter((corner) => board[corner] === '')
}

/**
 * Get side positions that are available
 */
export function getAvailableSides(board: Board): number[] {
  const sides = [1, 3, 5, 7]
  return sides.filter((side) => board[side] === '')
}

/**
 * Generate a descriptive move string for logging/history
 */
export function getMoveDescription(index: number, player: Player): string {
  const { row, col } = indexToPosition(index)
  return `${player} -> Row ${row + 1}, Col ${col + 1} (${index})`
}

/**
 * Calculate game score for a player (used in AI evaluation)
 */
export function calculateScore(result: GameResult, player: Player): number {
  if (result.winner === player) return 10
  if (result.winner === getOpponent(player)) return -10
  return 0 // Draw or ongoing game
}

/**
 * Check if the board is in a valid state
 */
export function validateBoardState(board: Board): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check board length
  if (board.length !== 9) {
    errors.push('Board must have exactly 9 cells')
  }

  // Count X and O pieces
  const xCount = board.filter((cell) => cell === 'X').length
  const oCount = board.filter((cell) => cell === 'O').length

  // X should go first, so X count should be equal to O count or one more
  if (xCount < oCount || xCount > oCount + 1) {
    errors.push('Invalid piece count - X goes first')
  }

  // Check for invalid cell values
  const validCells = ['', 'X', 'O']
  const invalidCells = board.filter((cell) => !validCells.includes(cell))
  if (invalidCells.length > 0) {
    errors.push(`Invalid cell values: ${invalidCells.join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Create an empty board
 */
export function createEmptyBoard(): Board {
  return Array(9).fill('') as Board
}

/**
 * Clone a board
 */
export function cloneBoard(board: Board): Board {
  return [...board] as Board
}
