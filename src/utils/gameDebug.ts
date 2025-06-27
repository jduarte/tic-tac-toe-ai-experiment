import type { Player, Board } from '../composables/useGameState'
import { GameEngine } from './gameEngine'
import { WINNING_COMBINATIONS } from './gameLogic'

// Board visualization utilities
export function printBoard(board: Board): string {
  const formatCell = (cell: string, index: number) => {
    return cell || index.toString()
  }

  const rows = [
    `${formatCell(board[0], 0)} | ${formatCell(board[1], 1)} | ${formatCell(board[2], 2)}`,
    '---------',
    `${formatCell(board[3], 3)} | ${formatCell(board[4], 4)} | ${formatCell(board[5], 5)}`,
    '---------',
    `${formatCell(board[6], 6)} | ${formatCell(board[7], 7)} | ${formatCell(board[8], 8)}`,
  ]

  return rows.join('\n')
}

// Console logger for game events
export class GameLogger {
  private logs: string[] = []
  private enabled: boolean = true

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  log(message: string): void {
    if (this.enabled) {
      const timestamp = new Date().toISOString()
      const logEntry = `[${timestamp}] ${message}`
      this.logs.push(logEntry)
      console.log(logEntry)
    }
  }

  logMove(player: Player, index: number, board: Board): void {
    this.log(`Player ${player} moves to position ${index}`)
    this.log(`Board state:\n${printBoard(board)}`)
  }

  logGameEnd(winner: Player | null, isDraw: boolean): void {
    if (winner) {
      this.log(`Game Over! Winner: Player ${winner}`)
    } else if (isDraw) {
      this.log("Game Over! It's a draw!")
    }
  }

  logGameStart(): void {
    this.log('New game started')
  }

  getLogs(): string[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }

  exportLogs(): string {
    return this.logs.join('\n')
  }
}

// Game analyzer for testing and validation
export class GameAnalyzer {
  static analyzePosition(board: Board): {
    emptyCells: number[]
    playerPositions: { [key in Player]: number[] }
    threatsFor: { [key in Player]: number[] }
    winningMovesFor: { [key in Player]: number[] }
  } {
    const emptyCells = board
      .map((cell, index) => (cell === '' ? index : -1))
      .filter((index) => index !== -1)

    const playerPositions: { [key in Player]: number[] } = {
      X: board.map((cell, index) => (cell === 'X' ? index : -1)).filter((index) => index !== -1),
      O: board.map((cell, index) => (cell === 'O' ? index : -1)).filter((index) => index !== -1),
    }

    const threatsFor: { [key in Player]: number[] } = { X: [], O: [] }
    const winningMovesFor: { [key in Player]: number[] } = { X: [], O: [] }

    // Analyze each winning combination
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      const cells = [board[a], board[b], board[c]]
      const emptyCellsInCombo = combination.filter((pos) => board[pos] === '')

      // Check for threats and winning moves
      if (emptyCellsInCombo.length === 1) {
        const emptyPos = emptyCellsInCombo[0]
        const filledCells = cells.filter((cell) => cell !== '')

        if (filledCells.length === 2 && filledCells[0] === filledCells[1]) {
          const player = filledCells[0] as Player
          winningMovesFor[player].push(emptyPos)

          // This is also a threat that needs to be blocked
          const opponent = player === 'X' ? 'O' : 'X'
          threatsFor[opponent].push(emptyPos)
        }
      }
    }

    return {
      emptyCells,
      playerPositions,
      threatsFor,
      winningMovesFor,
    }
  }

  static validateGameSequence(moves: { player: Player; position: number }[]): {
    isValid: boolean
    errors: string[]
    finalBoard: Board
  } {
    const errors: string[] = []
    const board: Board = Array(9).fill('')
    let currentPlayer: Player = 'X'

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i]

      // Check player order
      if (move.player !== currentPlayer) {
        errors.push(`Move ${i + 1}: Expected ${currentPlayer}, got ${move.player}`)
      }

      // Check position validity
      if (move.position < 0 || move.position > 8) {
        errors.push(`Move ${i + 1}: Position ${move.position} is out of bounds`)
      }

      // Check if position is already occupied
      if (board[move.position] !== '') {
        errors.push(`Move ${i + 1}: Position ${move.position} is already occupied`)
      }

      // Apply move
      if (errors.length === 0 || (move.position >= 0 && move.position <= 8)) {
        board[move.position] = move.player
      }

      // Switch player
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
    }

    return {
      isValid: errors.length === 0,
      errors,
      finalBoard: board,
    }
  }

  static suggestBestMoves(
    board: Board,
    player: Player,
  ): {
    winningMoves: number[]
    blockingMoves: number[]
    strategicMoves: number[]
    randomMoves: number[]
  } {
    const analysis = this.analyzePosition(board)

    return {
      winningMoves: analysis.winningMovesFor[player] || [],
      blockingMoves: analysis.threatsFor[player] || [],
      strategicMoves: this.getStrategicMoves(board),
      randomMoves: analysis.emptyCells,
    }
  }

  private static getStrategicMoves(board: Board): number[] {
    const strategicMoves: number[] = []

    // Center is strategic if available
    if (board[4] === '') {
      strategicMoves.push(4)
    }

    // Corners are strategic
    const corners = [0, 2, 6, 8]
    corners.forEach((corner) => {
      if (board[corner] === '') {
        strategicMoves.push(corner)
      }
    })

    return strategicMoves
  }
}

// Performance testing utilities
export class GamePerformanceTester {
  static async measureMovePerformance(
    engine: GameEngine,
    moves: number[],
  ): Promise<{
    totalTime: number
    averageTime: number
    moveTimes: number[]
  }> {
    const moveTimes: number[] = []
    const startTime = performance.now()

    for (const move of moves) {
      const moveStartTime = performance.now()
      engine.makeMove(move)
      const moveEndTime = performance.now()
      moveTimes.push(moveEndTime - moveStartTime)
    }

    const endTime = performance.now()
    const totalTime = endTime - startTime
    const averageTime = totalTime / moves.length

    return {
      totalTime,
      averageTime,
      moveTimes,
    }
  }

  static generateRandomGameSequence(maxMoves: number = 9): number[] {
    const availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const sequence: number[] = []

    while (sequence.length < maxMoves && availableMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length)
      const move = availableMoves[randomIndex]
      sequence.push(move)
      availableMoves.splice(randomIndex, 1)
    }

    return sequence
  }
}

// Test scenarios
export const TEST_SCENARIOS = {
  // Quick win scenarios
  QUICK_WIN_X: [
    { player: 'X' as Player, position: 0 },
    { player: 'O' as Player, position: 3 },
    { player: 'X' as Player, position: 1 },
    { player: 'O' as Player, position: 4 },
    { player: 'X' as Player, position: 2 }, // X wins with top row
  ],

  // Blocking scenario
  BLOCK_SCENARIO: [
    { player: 'X' as Player, position: 0 },
    { player: 'O' as Player, position: 4 },
    { player: 'X' as Player, position: 1 },
    { player: 'O' as Player, position: 2 }, // O blocks X's top row win
  ],

  // Draw game
  DRAW_GAME: [
    { player: 'X' as Player, position: 0 },
    { player: 'O' as Player, position: 4 },
    { player: 'X' as Player, position: 8 },
    { player: 'O' as Player, position: 2 },
    { player: 'X' as Player, position: 6 },
    { player: 'O' as Player, position: 1 },
    { player: 'X' as Player, position: 3 },
    { player: 'O' as Player, position: 7 },
    { player: 'X' as Player, position: 5 },
  ],
}
