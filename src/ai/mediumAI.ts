import type { Player, Board } from '../composables/useGameState'
import { BaseAIPlayer, AIMoveEvaluator } from './aiPlayer'
import type { AIMoveResult } from './aiPlayer'

/**
 * Medium AI Player - Strategic play with some tactical awareness
 *
 * Strategy:
 * 1. Always win if possible
 * 2. Always block opponent wins
 * 3. Take center if available
 * 4. Take corners over edges
 * 5. Create forks when possible
 * 6. Block opponent forks
 *
 * This creates a challenging AI that requires strategic thinking to beat
 */
export class MediumAI extends BaseAIPlayer {
  getName(): string {
    return 'Medium AI'
  }

  getDescription(): string {
    return 'Strategic play with tactical awareness'
  }

  async makeMove(board: Board, player: Player): Promise<AIMoveResult> {
    const startTime = performance.now()

    // Add thinking delay for better UX
    await this.addThinkingDelay(500, 1200)

    const availableMoves = this.getAvailableMoves(board)

    if (availableMoves.length === 0) {
      throw new Error('No available moves')
    }

    let selectedMove: number
    let reasoning: string
    let confidence: number

    // 1. Win if possible
    const winningMove = this.findWinningMove(board, player)
    if (winningMove !== null) {
      selectedMove = winningMove
      reasoning = 'Winning move found'
      confidence = 1.0
    } else {
      // 2. Block opponent win
      const blockingMove = this.findBlockingMove(board, player)
      if (blockingMove !== null) {
        selectedMove = blockingMove
        reasoning = 'Blocked opponent win'
        confidence = 0.9
      } else {
        // 3. Create fork if possible
        const forkMove = this.findForkMove(board, player)
        if (forkMove !== null) {
          selectedMove = forkMove
          reasoning = 'Created fork opportunity'
          confidence = 0.8
        } else {
          // 4. Block opponent fork
          const blockForkMove = this.findBlockForkMove(board, player)
          if (blockForkMove !== null) {
            selectedMove = blockForkMove
            reasoning = 'Blocked opponent fork'
            confidence = 0.75
          } else {
            // 5. Take center if available
            if (board[4] === '') {
              selectedMove = 4
              reasoning = 'Took center position'
              confidence = 0.7
            } else {
              // 6. Strategic positional play
              const strategicMove = this.findStrategicMove(board, player)
              selectedMove = strategicMove.move
              reasoning = strategicMove.reasoning
              confidence = strategicMove.confidence
            }
          }
        }
      }
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

  private findForkMove(board: Board, player: Player): number | null {
    const availableMoves = this.getAvailableMoves(board)

    for (const move of availableMoves) {
      const testBoard = this.simulateMove(board, move, player)
      const winningMoves = this.countWinningMoves(testBoard, player)

      // A fork creates multiple winning opportunities
      if (winningMoves >= 2) {
        return move
      }
    }

    return null
  }

  private findBlockForkMove(board: Board, player: Player): number | null {
    const opponent = this.getOpponent(player)
    const availableMoves = this.getAvailableMoves(board)

    // Find all opponent fork moves
    const opponentForkMoves: number[] = []
    for (const move of availableMoves) {
      const testBoard = this.simulateMove(board, move, opponent)
      const winningMoves = this.countWinningMoves(testBoard, opponent)

      if (winningMoves >= 2) {
        opponentForkMoves.push(move)
      }
    }

    // If there's only one fork move, block it
    if (opponentForkMoves.length === 1) {
      return opponentForkMoves[0]
    }

    // If multiple fork moves, try to create a two-in-a-row to force opponent to defend
    if (opponentForkMoves.length > 1) {
      for (const move of availableMoves) {
        if (!opponentForkMoves.includes(move)) {
          const testBoard = this.simulateMove(board, move, player)
          if (this.createsTwoInARow(testBoard, player, move)) {
            return move
          }
        }
      }
    }

    return null
  }

  private findStrategicMove(
    board: Board,
    player: Player,
  ): { move: number; reasoning: string; confidence: number } {
    const availableMoves = this.getAvailableMoves(board)
    const priorities = AIMoveEvaluator.getStrategicPriorities(board)

    // Prefer corners over edges
    if (priorities.corners.length > 0) {
      // If opponent is in opposite corner, take a different corner
      const opponentCorners = priorities.corners.filter((corner) => {
        const oppositeCorner = this.getOppositeCorner(corner)
        return oppositeCorner !== null && board[oppositeCorner] === this.getOpponent(player)
      })

      if (opponentCorners.length > 0) {
        const move = opponentCorners[0]
        return { move, reasoning: 'Strategic corner play', confidence: 0.6 }
      }

      const move = priorities.corners[Math.floor(Math.random() * priorities.corners.length)]
      return { move, reasoning: 'Took corner position', confidence: 0.6 }
    }

    // Take edges as fallback
    if (priorities.edges.length > 0) {
      const move = priorities.edges[Math.floor(Math.random() * priorities.edges.length)]
      return { move, reasoning: 'Took edge position', confidence: 0.4 }
    }

    // Fallback to any available move
    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)]
    return { move, reasoning: 'Random available move', confidence: 0.3 }
  }

  private countWinningMoves(board: Board, player: Player): number {
    const availableMoves = this.getAvailableMoves(board)
    let count = 0

    for (const move of availableMoves) {
      if (AIMoveEvaluator.isWinningMove(board, move, player)) {
        count++
      }
    }

    return count
  }

  private createsTwoInARow(board: Board, player: Player, lastMove: number): boolean {
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
      if (combination.includes(lastMove)) {
        const playerCount = combination.filter((pos) => board[pos] === player).length
        const emptyCount = combination.filter((pos) => board[pos] === '').length

        // Two in a row means 2 player pieces and 1 empty
        if (playerCount === 2 && emptyCount === 1) {
          return true
        }
      }
    }

    return false
  }

  private getOppositeCorner(corner: number): number | null {
    const opposites: { [key: number]: number } = {
      0: 8,
      2: 6,
      6: 2,
      8: 0,
    }
    return opposites[corner] || null
  }

  // Enhanced position evaluation
  evaluatePosition(board: Board, player: Player): number {
    return AIMoveEvaluator.evaluateBoard(board, player)
  }
}
