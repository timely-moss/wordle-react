import { isWordInDictionary } from './dictionary'
import { getCurrentRow, getWordLength } from './row-semantics'
import { isGameTerminal } from './status'
import type { GameState } from './types'

export type SubmitGuessValidation =
  | 'ok'
  | 'terminal'
  | 'no_current_row'
  | 'incomplete'
  | 'invalid_word'

export function validateSubmitGuess(state: GameState): SubmitGuessValidation {
  if (isGameTerminal(state)) {
    return 'terminal'
  }

  const currentRow = getCurrentRow(state)
  if (currentRow === null) {
    return 'no_current_row'
  }

  if (currentRow.length !== getWordLength(state)) {
    return 'incomplete'
  }

  if (!isWordInDictionary(currentRow)) {
    return 'invalid_word'
  }

  return 'ok'
}
