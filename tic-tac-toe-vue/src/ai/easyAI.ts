import type { Player, Board } from '../composables/useGameState'
import { BaseAIPlayer, AIMoveEvaluator } from './aiPlayer'
import type { AIMoveResult } from './aiPlayer'

/**
 * Easy AI Player - Makes mostly random moves with basic win detection
 *
 * Strategy:
 * 1. Win if possible (20% of the time it misses obvious wins)
 * 2. Block opponent wins (30% of the time it misses blocks)
 * 3. Otherwise make random moves
 *
 * This creates a beatable AI that still poses some challenge
 */
export class EasyAI extends BaseAIPlayer {
  private readonly winDetectionRate = 0.8 // 80% chance to detect wins
  private readonly blockDetectionRate = 0.7 // 70% chance to detect blocks

  getName(): string {
    return 'Easy AI'
  }

  getDescription(): string {
    return 'Makes random moves with occasional strategic play'
  }

  async makeMove(board: Board, player: Player): Promise<AIMoveResult> {
    const startTime = performance.now()

    // Add thinking delay for better UX
    await this.addThinkingDelay(200, 800)

    const availableMoves = this.getAvailableMoves(board)

    if (availableMoves.length === 0) {
      throw new Error('No available moves')
    }

    let selectedMove: number
    let reasoning: string
    let confidence: number

    // 1. Try to win (with some probability of missing)
    if (Math.random() < this.winDetectionRate) {
      const winningMove = this.findWinningMove(board, player)
      if (winningMove !== null) {
        selectedMove = winningMove
        reasoning = 'Found winning move'
        confidence = 0.9
      } else {
        // 2. Try to block opponent win (with some probability of missing)
        if (Math.random() < this.blockDetectionRate) {
          const blockingMove = this.findBlockingMove(board, player)
          if (blockingMove !== null) {
            selectedMove = blockingMove
            reasoning = 'Blocked opponent winning move'
            confidence = 0.7
          } else {
            // 3. Make random move
            selectedMove = this.makeRandomMove(availableMoves)
            reasoning = 'Random move'
            confidence = 0.3
          }
        } else {
          // Missed the block opportunity
          selectedMove = this.makeRandomMove(availableMoves)
          reasoning = 'Random move (missed block)'
          confidence = 0.2
        }
      }
    } else {
      // Missed the winning opportunity
      selectedMove = this.makeRandomMove(availableMoves)
      reasoning = 'Random move (missed win)'
      confidence = 0.1
    }

    const endTime = performance.now()

    return {
      move: selectedMove,
      confidence,
      reasoning,
      evaluationTime: endTime - startTime,
    }
  }

  private findWinningMove(board: Board, player: Player): number | null {
    const availableMoves = this.getAvailableMoves(board)

    for (const move of availableMoves) {
      if (AIMoveEvaluator.isWinningMove(board, move, player)) {
        return move
      }
    }

    return null
  }

  private findBlockingMove(board: Board, player: Player): number | null {
    const availableMoves = this.getAvailableMoves(board)

    for (const move of availableMoves) {
      if (AIMoveEvaluator.isBlockingMove(board, move, player)) {
        return move
      }
    }

    return null
  }

  private makeRandomMove(availableMoves: number[]): number {
    const randomIndex = Math.floor(Math.random() * availableMoves.length)
    return availableMoves[randomIndex]
  }

  // Optional: Evaluate position (for analysis purposes)
  evaluatePosition(board: Board, player: Player): number {
    // Simple evaluation: just count the difference in pieces
    const playerCount = board.filter((cell) => cell === player).length
    const opponentCount = board.filter((cell) => cell === this.getOpponent(player)).length

    return playerCount - opponentCount
  }
}
