import type { Player, Board } from '../composables/useGameState'
import type { AIDifficulty } from '../composables/useGameMode'
import type { AIPlayer, AIMoveResult } from './aiPlayer'
import { EasyAI } from './easyAI'
import { MediumAI } from './mediumAI'
import { HardAI } from './hardAI'

/**
 * AI Manager - Factory and coordinator for AI players
 */
export class AIManager {
  private aiPlayer: AIPlayer | null = null
  private isThinking = false

  // Create AI player based on difficulty
  createAI(difficulty: AIDifficulty, player: Player): AIPlayer {
    switch (difficulty) {
      case 'easy':
        return new EasyAI(difficulty, player)
      case 'medium':
        return new MediumAI(difficulty, player)
      case 'hard':
        return new HardAI(difficulty, player)
      default:
        throw new Error(`Unknown AI difficulty: ${difficulty}`)
    }
  }

  // Set current AI player
  setAI(difficulty: AIDifficulty, player: Player): void {
    this.aiPlayer = this.createAI(difficulty, player)
  }

  // Get current AI player
  getAI(): AIPlayer | null {
    return this.aiPlayer
  }

  // Check if AI is currently thinking
  isAIThinking(): boolean {
    return this.isThinking
  }

  // Make AI move
  async makeAIMove(board: Board, player: Player): Promise<AIMoveResult> {
    if (!this.aiPlayer) {
      throw new Error('No AI player configured')
    }

    if (this.isThinking) {
      throw new Error('AI is already thinking')
    }

    try {
      this.isThinking = true
      const result = await this.aiPlayer.makeMove(board, player)
      return result
    } finally {
      this.isThinking = false
    }
  }

  // Get AI description
  getAIDescription(): string {
    return this.aiPlayer?.getDescription() || 'No AI configured'
  }

  // Get AI name
  getAIName(): string {
    return this.aiPlayer?.getName() || 'No AI'
  }

  // Get difficulty level
  getDifficulty(): AIDifficulty | null {
    return this.aiPlayer?.difficulty || null
  }

  // Evaluate position with current AI (if supported)
  evaluatePosition(board: Board, player: Player): number | null {
    if (this.aiPlayer && this.aiPlayer.evaluatePosition) {
      return this.aiPlayer.evaluatePosition(board, player)
    }
    return null
  }

  // Static method to quickly test a move with specific difficulty
  static async testMove(
    board: Board,
    player: Player,
    difficulty: AIDifficulty,
  ): Promise<AIMoveResult> {
    const manager = new AIManager()
    manager.setAI(difficulty, player)
    return await manager.makeAIMove(board, player)
  }

  // Static method to get AI info without instantiation
  static getAIInfo(difficulty: AIDifficulty): { name: string; description: string } {
    switch (difficulty) {
      case 'easy':
        return {
          name: 'Easy AI',
          description: 'Makes random moves with occasional strategic play',
        }
      case 'medium':
        return {
          name: 'Medium AI',
          description: 'Strategic play with tactical awareness',
        }
      case 'hard':
        return {
          name: 'Hard AI',
          description: 'Perfect play using minimax algorithm',
        }
      default:
        return {
          name: 'Unknown AI',
          description: 'Unknown difficulty level',
        }
    }
  }

  // Get all available difficulties
  static getAvailableDifficulties(): AIDifficulty[] {
    return ['easy', 'medium', 'hard']
  }

  // Performance testing utilities
  static async benchmarkAI(
    difficulty: AIDifficulty,
    testPositions: Board[],
    player: Player,
  ): Promise<{
    averageTime: number
    totalTime: number
    results: AIMoveResult[]
  }> {
    const manager = new AIManager()
    manager.setAI(difficulty, player)

    const results: AIMoveResult[] = []
    const startTime = performance.now()

    for (const board of testPositions) {
      const result = await manager.makeAIMove(board, player)
      results.push(result)
    }

    const endTime = performance.now()
    const totalTime = endTime - startTime
    const averageTime = totalTime / testPositions.length

    return {
      averageTime,
      totalTime,
      results,
    }
  }

  // AI vs AI simulation
  static async simulateAIGame(
    player1Difficulty: AIDifficulty,
    player2Difficulty: AIDifficulty,
    maxMoves: number = 20,
  ): Promise<{
    winner: Player | null
    isDraw: boolean
    moveHistory: Array<{ player: Player; move: number; reasoning: string }>
    finalBoard: Board
    totalMoves: number
  }> {
    const board: Board = Array(9).fill('')
    const moveHistory: Array<{ player: Player; move: number; reasoning: string }> = []

    const ai1 = new AIManager()
    const ai2 = new AIManager()
    ai1.setAI(player1Difficulty, 'X')
    ai2.setAI(player2Difficulty, 'O')

    let currentPlayer: Player = 'X'
    let moveCount = 0

    while (moveCount < maxMoves) {
      const availableMoves = board
        .map((cell, index) => (cell === '' ? index : -1))
        .filter((index) => index !== -1)

      if (availableMoves.length === 0) break

      // Check for winner
      const winner = this.checkWinner(board)
      if (winner) {
        return {
          winner,
          isDraw: false,
          moveHistory,
          finalBoard: [...board],
          totalMoves: moveCount,
        }
      }

      // Make AI move
      const ai = currentPlayer === 'X' ? ai1 : ai2
      const result = await ai.makeAIMove(board, currentPlayer)

      // Apply move
      board[result.move] = currentPlayer
      moveHistory.push({
        player: currentPlayer,
        move: result.move,
        reasoning: result.reasoning,
      })

      // Switch players
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
      moveCount++
    }

    // Check final winner
    const winner = this.checkWinner(board)
    const isDraw = !winner && board.every((cell) => cell !== '')

    return {
      winner,
      isDraw,
      moveHistory,
      finalBoard: [...board],
      totalMoves: moveCount,
    }
  }

  private static checkWinner(board: Board): Player | null {
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
}

// Export a singleton instance for easy use
export const aiManager = new AIManager()

// Export types for convenience
export type { AIPlayer, AIMoveResult }
