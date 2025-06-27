import { ref, computed, readonly } from 'vue'

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
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
]

export function useGameState() {
  // Reactive state
  const board = ref<Board>(Array(9).fill(''))
  const currentPlayer = ref<Player>('X')
  const status = ref<GameStatus>('playing')
  const winner = ref<Player | null>(null)
  const moveCount = ref(0)
  const winningLine = ref<number[] | null>(null)

  // Computed properties
  const gameState = computed<GameState>(() => ({
    board: board.value,
    currentPlayer: currentPlayer.value,
    status: status.value,
    winner: winner.value,
    moveCount: moveCount.value,
    winningLine: winningLine.value,
  }))

  const isGameOver = computed(() => status.value !== 'playing')
  const isBoardFull = computed(() => moveCount.value === 9)

  // Core game functions
  function checkWinner(board: Board): { winner: Player | null; line: number[] | null } {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a] as Player, line: combination }
      }
    }
    return { winner: null, line: null }
  }

  function makeMove(index: number): boolean {
    // Validate move
    if (board.value[index] !== '' || isGameOver.value) {
      return false
    }

    // Make the move
    board.value[index] = currentPlayer.value
    moveCount.value++

    // Check for winner
    const result = checkWinner(board.value)
    if (result.winner) {
      winner.value = result.winner
      winningLine.value = result.line
      status.value = 'won'
      return true
    }

    // Check for tie
    if (isBoardFull.value) {
      status.value = 'tie'
      return true
    }

    // Switch players
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
    return true
  }

  function resetGame(): void {
    board.value = Array(9).fill('')
    currentPlayer.value = 'X'
    status.value = 'playing'
    winner.value = null
    moveCount.value = 0
    winningLine.value = null
  }

  function isValidMove(index: number): boolean {
    return board.value[index] === '' && !isGameOver.value
  }

  function getAvailableMoves(): number[] {
    return board.value
      .map((cell, index) => (cell === '' ? index : -1))
      .filter((index) => index !== -1)
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
    isGameOver: readonly(isGameOver),
    isBoardFull: readonly(isBoardFull),

    // Actions
    makeMove,
    resetGame,
    isValidMove,
    getAvailableMoves,
    checkWinner,
  }
}
