import type { Player, Board } from '../composables/useGameState'
import { BaseAIPlayer, AIMoveEvaluator } from './aiPlayer'
import type { AIMoveResult } from './aiPlayer'

/**
 * Hard AI Player - Perfect play using minimax algorithm
 *
 * Uses minimax with alpha-beta pruning for optimal play.
 * This AI should never lose and will win when possible.
 * At worst, it will force a draw against perfect play.
 */
export class HardAI extends BaseAIPlayer {
  private readonly maxDepth = 10 // Should be enough for tic-tac-toe

  getName(): string {
    return 'Hard AI'
  }

  getDescription(): string {
    return 'Perfect play using minimax algorithm'
  }

  async makeMove(board: Board, player: Player): Promise<AIMoveResult> {
    const startTime = performance.now()

    // Add thinking delay for better UX (AI appears to be "thinking")
    await this.addThinkingDelay(800, 2000)

    const availableMoves = this.getAvailableMoves(board)

    if (availableMoves.length === 0) {
      throw new Error('No available moves')
    }

    // Use minimax to find the best move
    const result = this.minimax(board, 0, player, -Infinity, Infinity, true)

    const endTime = performance.now()

    return {
      move: result.bestMove,
      confidence: this.calculateConfidence(result.bestScore),
      reasoning: this.getReasoningFromScore(result.bestScore, availableMoves.length),
      evaluationTime: endTime - startTime,
    }
  }

  private minimax(
    board: Board,
    depth: number,
    player: Player,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
  ): { bestScore: number; bestMove: number } {
    // Terminal conditions
    const winner = AIMoveEvaluator.checkWinner(board)
    if (winner === player) return { bestScore: 10 - depth, bestMove: -1 }
    if (winner === this.getOpponent(player)) return { bestScore: -10 + depth, bestMove: -1 }

    const availableMoves = this.getAvailableMoves(board)
    if (availableMoves.length === 0) return { bestScore: 0, bestMove: -1 } // Draw

    if (depth >= this.maxDepth) {
      return { bestScore: this.evaluatePosition(board, player), bestMove: -1 }
    }

    let bestMove = availableMoves[0]

    if (isMaximizing) {
      let maxScore = -Infinity

      for (const move of availableMoves) {
        const newBoard = this.simulateMove(board, move, player)
        const score = this.minimax(newBoard, depth + 1, player, alpha, beta, false).bestScore

        if (score > maxScore) {
          maxScore = score
          bestMove = move
        }

        alpha = Math.max(alpha, score)
        if (beta <= alpha) break // Alpha-beta pruning
      }

      return { bestScore: maxScore, bestMove }
    } else {
      let minScore = Infinity
      const opponent = this.getOpponent(player)

      for (const move of availableMoves) {
        const newBoard = this.simulateMove(board, move, opponent)
        const score = this.minimax(newBoard, depth + 1, player, alpha, beta, true).bestScore

        if (score < minScore) {
          minScore = score
          bestMove = move
        }

        beta = Math.min(beta, score)
        if (beta <= alpha) break // Alpha-beta pruning
      }

      return { bestScore: minScore, bestMove }
    }
  }

  private calculateConfidence(score: number): number {
    // Convert minimax score to confidence (0-1)
    if (score >= 8) return 1.0 // Winning position
    if (score >= 4) return 0.9 // Very good position
    if (score >= 1) return 0.8 // Good position
    if (score === 0) return 0.7 // Equal position
    if (score >= -1) return 0.6 // Slightly worse position
    if (score >= -4) return 0.5 // Worse position
    if (score >= -8) return 0.4 // Bad position
    return 0.3 // Losing position
  }

  private getReasoningFromScore(score: number, availableMoves: number): string {
    if (score >= 8) return 'Found winning sequence'
    if (score >= 4) return 'Strong tactical advantage'
    if (score >= 1) return 'Favorable position'
    if (score === 0) return 'Balanced position, best available'
    if (score >= -1) return 'Defensive move'
    if (score >= -4) return 'Damage control'
    if (score >= -8) return 'Preventing immediate loss'

    if (availableMoves === 1) return 'Only move available'
    return 'Minimizing opponent advantage'
  }

  // Enhanced position evaluation for non-terminal positions
  evaluatePosition(board: Board, player: Player): number {
    const winner = AIMoveEvaluator.checkWinner(board)
    if (winner === player) return 10
    if (winner === this.getOpponent(player)) return -10

    let score = 0
    const opponent = this.getOpponent(player)

    // Evaluate all winning combinations
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
      const lineScore = this.evaluateLine(board, combination, player, opponent)
      score += lineScore
    }

    return score
  }

  private evaluateLine(board: Board, line: number[], player: Player, opponent: Player): number {
    let score = 0
    let playerCount = 0
    let opponentCount = 0

    for (const pos of line) {
      if (board[pos] === player) playerCount++
      else if (board[pos] === opponent) opponentCount++
    }

    // Can't win if opponent has pieces in this line
    if (playerCount > 0 && opponentCount > 0) return 0

    if (playerCount === 3)
      score += 100 // Won
    else if (playerCount === 2)
      score += 10 // Two in a row
    else if (playerCount === 1) score += 1 // One in a row

    if (opponentCount === 3)
      score -= 100 // Lost
    else if (opponentCount === 2)
      score -= 10 // Opponent two in a row
    else if (opponentCount === 1) score -= 1 // Opponent one in a row

    return score
  }

  // Static method for testing the AI without instantiation
  static async testMove(board: Board, player: Player): Promise<number> {
    const ai = new HardAI('hard', player)
    const result = await ai.makeMove(board, player)
    return result.move
  }

  // Method to analyze all possible moves and their scores
  async analyzeAllMoves(
    board: Board,
    player: Player,
  ): Promise<Array<{ move: number; score: number; reasoning: string }>> {
    const availableMoves = this.getAvailableMoves(board)
    const analyses: Array<{ move: number; score: number; reasoning: string }> = []

    for (const move of availableMoves) {
      const newBoard = this.simulateMove(board, move, player)
      const result = this.minimax(newBoard, 0, player, -Infinity, Infinity, false)

      analyses.push({
        move,
        score: result.bestScore,
        reasoning: this.getReasoningFromScore(result.bestScore, availableMoves.length),
      })
    }

    // Sort by score (best moves first)
    analyses.sort((a, b) => b.score - a.score)

    return analyses
  }
}
