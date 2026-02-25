import type { GameState } from './types'

export function getWordLength(state: GameState): number {
  return state.solution.length
}

export function getCappedRows(state: GameState): string[] {
  return state.rows.slice(0, state.maxGuesses)
}

function hasSubmittedFinalRow(state: GameState): boolean {
  return state.rows.length > state.maxGuesses
}

export function hasCurrentRow(state: GameState): boolean {
  if (state.maxGuesses === 0 || state.rows.length === 0) {
    return false
  }

  return !hasSubmittedFinalRow(state)
}

export function getSubmittedRows(state: GameState): string[] {
  const rows = getCappedRows(state)
  if (rows.length === 0) {
    return []
  }

  if (hasSubmittedFinalRow(state)) {
    return rows
  }

  return rows.slice(0, -1)
}

export function getCurrentRow(state: GameState): string | null {
  if (!hasCurrentRow(state)) {
    return null
  }

  const rows = getCappedRows(state)
  return rows[rows.length - 1] ?? ''
}

export function getCurrentRowIndex(state: GameState): number | null {
  if (!hasCurrentRow(state)) {
    return null
  }

  return Math.max(0, getCappedRows(state).length - 1)
}
