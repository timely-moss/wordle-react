import type {
  GameBoardRowData,
  GameState,
  GameTileData,
  KeyboardKeyState,
  KeyboardStatesData,
  TileState,
} from './types'
import { getCurrentRow, getSubmittedRows } from './row-semantics'

type BoardConfig = {
  maxRows: number
  wordLength: number
}

const keyboardStatePriority: Record<KeyboardKeyState, number> = {
  default: 0,
  absent: 1,
  present: 2,
  correct: 3,
}

function createEmptyTile(): GameTileData {
  return { letter: '', state: 'empty' }
}

function stringToTiles(word: string, wordLength: number): GameBoardRowData {
  const normalizedWord = word.toUpperCase().slice(0, wordLength)
  const tiles: GameBoardRowData = normalizedWord.split('').map((letter) => ({
    letter,
    state: 'empty',
  }))

  while (tiles.length < wordLength) {
    tiles.push(createEmptyTile())
  }

  return tiles
}

function evaluateSubmittedRow(
  guess: string,
  solution: string,
  wordLength: number,
): GameBoardRowData {
  const normalizedGuess = guess.toUpperCase().slice(0, wordLength)
  const normalizedSolution = solution.toUpperCase().slice(0, wordLength)
  const guessLetters = normalizedGuess.split('')
  const tiles = stringToTiles(normalizedGuess, wordLength)
  const remainingCounts = new Map<string, number>()

  for (let index = 0; index < wordLength; index += 1) {
    const guessLetter = guessLetters[index] ?? ''
    const solutionLetter = normalizedSolution[index] ?? ''

    if (!guessLetter) {
      continue
    }

    if (guessLetter === solutionLetter) {
      tiles[index].state = 'correct'
    } else {
      remainingCounts.set(
        solutionLetter,
        (remainingCounts.get(solutionLetter) ?? 0) + 1,
      )
    }
  }

  for (let index = 0; index < wordLength; index += 1) {
    if (tiles[index].state === 'correct') {
      continue
    }

    const guessLetter = guessLetters[index] ?? ''
    if (!guessLetter) {
      continue
    }

    const remainingCount = remainingCounts.get(guessLetter) ?? 0
    if (remainingCount > 0) {
      tiles[index].state = 'present'
      remainingCounts.set(guessLetter, remainingCount - 1)
    } else {
      tiles[index].state = 'absent'
    }
  }

  return tiles
}

function normalizeRow(row: GameBoardRowData, wordLength: number): GameBoardRowData {
  const normalized = row
    .slice(0, wordLength)
    .map((tile) => ({ letter: tile.letter, state: tile.state }))

  while (normalized.length < wordLength) {
    normalized.push(createEmptyTile())
  }

  return normalized
}

export function deriveGameBoardRowsData(
  submittedRows: GameBoardRowData[],
  config: BoardConfig,
): GameBoardRowData[] {
  const rows = submittedRows
    .slice(0, config.maxRows)
    .map((row) => normalizeRow(row, config.wordLength))

  while (rows.length < config.maxRows) {
    rows.push(Array.from({ length: config.wordLength }, createEmptyTile))
  }

  return rows
}

export function deriveGameBoardRowsFromState(
  gameState: GameState,
): GameBoardRowData[] {
  const derivedRows = deriveEvaluatedRowsFromState(gameState)
  const wordLength = gameState.solution.length
  while (derivedRows.length < gameState.maxGuesses) {
    derivedRows.push(Array.from({ length: wordLength }, createEmptyTile))
  }

  return derivedRows
}

export function deriveEvaluatedRowsFromState(gameState: GameState): GameBoardRowData[] {
  const wordLength = gameState.solution.length
  const submittedRows = getSubmittedRows(gameState)
  const currentRow = getCurrentRow(gameState)

  const derivedRows = submittedRows.map((row) =>
    evaluateSubmittedRow(row, gameState.solution, wordLength),
  )

  if (currentRow !== null) {
    derivedRows.push(stringToTiles(currentRow, wordLength))
  }

  return derivedRows
}

export function deriveKeyboardStatesData(
  submittedRows: GameBoardRowData[],
): KeyboardStatesData {
  return submittedRows.reduce<KeyboardStatesData>((states, row) => {
    row.forEach((tile) => {
      const letter = tile.letter.toUpperCase()
      const state = tile.state

      if (!letter || state === 'empty') {
        return
      }

      const nextState = state as Exclude<TileState, 'empty'>
      const currentState = states[letter] ?? 'default'

      if (keyboardStatePriority[nextState] >= keyboardStatePriority[currentState]) {
        states[letter] = nextState
      }
    })

    return states
  }, {})
}

export function deriveKeyboardStatesFromState(gameState: GameState): KeyboardStatesData {
  return deriveKeyboardStatesData(deriveEvaluatedRowsFromState(gameState))
}
