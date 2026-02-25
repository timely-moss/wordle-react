import type { GameAction, GameState } from './types'
import {
  getCappedRows,
  getCurrentRowIndex,
  getWordLength,
} from './row-semantics'
import { isGameTerminal } from './status'
import { validateSubmitGuess } from './submit-validation'

type InitializeGameStateParams = {
  solution: string
  maxGuesses: number
}

function normalizeTypedLetter(letter: string): string | null {
  if (!/^[a-z]$/i.test(letter)) {
    return null
  }

  return letter.toUpperCase()
}

export function initializeGameState({
  solution,
  maxGuesses,
}: InitializeGameStateParams): GameState {
  return {
    solution: solution.toUpperCase(),
    maxGuesses,
    rows: maxGuesses > 0 ? [''] : [],
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (isGameTerminal(state)) {
    return state
  }

  switch (action.type) {
    case 'type_letter': {
      const letter = normalizeTypedLetter(action.letter)
      if (!letter) {
        return state
      }

      const rowIndex = getCurrentRowIndex(state)
      if (rowIndex === null) {
        return state
      }

      const nextRows = [...getCappedRows(state)]
      const currentRow = nextRows[rowIndex] ?? ''

      if (currentRow.length >= getWordLength(state)) {
        return state
      }

      nextRows[rowIndex] = `${currentRow}${letter}`
      return { ...state, rows: nextRows }
    }

    case 'backspace': {
      const rowIndex = getCurrentRowIndex(state)
      if (rowIndex === null) {
        return state
      }

      const nextRows = [...getCappedRows(state)]
      const currentRow = nextRows[rowIndex] ?? ''
      if (currentRow.length === 0) {
        return state
      }

      nextRows[rowIndex] = currentRow.slice(0, -1)
      return { ...state, rows: nextRows }
    }

    case 'submit_guess': {
      const rowIndex = getCurrentRowIndex(state)
      if (rowIndex === null) {
        return state
      }

      const nextRows = [...getCappedRows(state)]
      if (validateSubmitGuess(state) !== 'ok') {
        return state
      }

      if (nextRows.length <= state.maxGuesses) {
        nextRows.push('')
      }

      return { ...state, rows: nextRows }
    }
  }
}
