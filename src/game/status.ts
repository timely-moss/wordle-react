import { getSubmittedRows, getWordLength } from './row-semantics'
import type { GameState } from './types'

export function isGameWon(state: GameState): boolean {
  const target = state.solution.toUpperCase()
  return getSubmittedRows(state).some(
    (row) => row.toUpperCase().slice(0, getWordLength(state)) === target,
  )
}

export function isGameLost(state: GameState): boolean {
  return !isGameWon(state) && getSubmittedRows(state).length >= state.maxGuesses
}

export function isGameTerminal(state: GameState): boolean {
  return isGameWon(state) || isGameLost(state)
}
