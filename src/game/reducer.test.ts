import { describe, expect, it } from 'vitest'
import { gameReducer, initializeGameState } from './reducer'
import type { GameAction, GameState } from './types'

function dispatchMany(initialState: GameState, actions: GameAction[]): GameState {
  return actions.reduce((state, action) => gameReducer(state, action), initialState)
}

describe('gameReducer', () => {
  it('initializes with one empty current row', () => {
    expect(initializeGameState({ solution: 'STANK', maxGuesses: 6 })).toEqual({
      solution: 'STANK',
      rows: [''],
      maxGuesses: 6,
    })
  })

  it('appends typed letters to the current row', () => {
    const initialState = initializeGameState({ solution: 'STANK', maxGuesses: 6 })
    const nextState = gameReducer(initialState, { type: 'type_letter', letter: 's' })
    expect(nextState.rows).toEqual(['S'])
  })

  it('ignores non-letter input and extra letters beyond word length', () => {
    const initialState = initializeGameState({ solution: 'STANK', maxGuesses: 6 })
    const nextState = dispatchMany(initialState, [
      { type: 'type_letter', letter: 'S' },
      { type: 'type_letter', letter: 'T' },
      { type: 'type_letter', letter: 'A' },
      { type: 'type_letter', letter: 'N' },
      { type: 'type_letter', letter: 'K' },
      { type: 'type_letter', letter: 'X' },
      { type: 'type_letter', letter: '1' },
      { type: 'type_letter', letter: 'AB' },
    ])
    expect(nextState.rows).toEqual(['STANK'])
  })

  it('removes one letter on backspace', () => {
    const initialState = initializeGameState({ solution: 'STANK', maxGuesses: 6 })
    const nextState = dispatchMany(initialState, [
      { type: 'type_letter', letter: 'S' },
      { type: 'type_letter', letter: 'T' },
      { type: 'backspace' },
    ])
    expect(nextState.rows).toEqual(['S'])
  })

  it('ignores submit when the current row is incomplete', () => {
    const initialState = initializeGameState({ solution: 'STANK', maxGuesses: 6 })
    const nextState = dispatchMany(initialState, [
      { type: 'type_letter', letter: 'S' },
      { type: 'submit_guess' },
    ])
    expect(nextState.rows).toEqual(['S'])
  })

  it('submits a full row and appends a new empty row while guesses remain', () => {
    const initialState = initializeGameState({ solution: 'STANK', maxGuesses: 6 })
    const nextState = dispatchMany(initialState, [
      { type: 'type_letter', letter: 'S' },
      { type: 'type_letter', letter: 'L' },
      { type: 'type_letter', letter: 'A' },
      { type: 'type_letter', letter: 'N' },
      { type: 'type_letter', letter: 'T' },
      { type: 'submit_guess' },
    ])
    expect(nextState.rows).toEqual(['SLANT', ''])
  })

  it('does not append an extra row when submitting the final allowed guess', () => {
    const initialState: GameState = {
      solution: 'STANK',
      rows: ['SLATE', 'SHARK', 'STORM', 'STACK', 'SMACK', ''],
      maxGuesses: 6,
    }

    const nextState = dispatchMany(initialState, [
      { type: 'type_letter', letter: 'S' },
      { type: 'type_letter', letter: 'N' },
      { type: 'type_letter', letter: 'A' },
      { type: 'type_letter', letter: 'C' },
      { type: 'type_letter', letter: 'K' },
      { type: 'submit_guess' },
    ])

    expect(nextState.rows).toEqual([
      'SLATE',
      'SHARK',
      'STORM',
      'STACK',
      'SMACK',
      'SNACK',
      '',
    ])
  })

  it('locks input after a winning submission', () => {
    const initialState: GameState = {
      solution: 'STANK',
      rows: ['SLANT', ''],
      maxGuesses: 6,
    }

    const nextState = dispatchMany(initialState, [
      { type: 'type_letter', letter: 'S' },
      { type: 'type_letter', letter: 'T' },
      { type: 'type_letter', letter: 'A' },
      { type: 'type_letter', letter: 'N' },
      { type: 'type_letter', letter: 'K' },
      { type: 'submit_guess' },
      { type: 'type_letter', letter: 'X' },
      { type: 'backspace' },
      { type: 'submit_guess' },
    ])

    expect(nextState.rows).toEqual(['SLANT', 'STANK', ''])
  })

  it('locks input after a losing submission', () => {
    const initialState: GameState = {
      solution: 'STANK',
      rows: ['SLATE', 'SHARK', 'STORM', 'STACK', 'SMACK', ''],
      maxGuesses: 6,
    }

    const nextState = dispatchMany(initialState, [
      { type: 'type_letter', letter: 'S' },
      { type: 'type_letter', letter: 'N' },
      { type: 'type_letter', letter: 'A' },
      { type: 'type_letter', letter: 'C' },
      { type: 'type_letter', letter: 'K' },
      { type: 'submit_guess' },
      { type: 'type_letter', letter: 'X' },
      { type: 'backspace' },
      { type: 'submit_guess' },
    ])

    expect(nextState.rows).toEqual([
      'SLATE',
      'SHARK',
      'STORM',
      'STACK',
      'SMACK',
      'SNACK',
      '',
    ])
  })

  it('does not auto-submit when typing the final letter on the last row', () => {
    const initialState: GameState = {
      solution: 'STANK',
      rows: ['SLATE', 'SHARK', 'STORM', 'STACK', 'SMACK', 'SNAC'],
      maxGuesses: 6,
    }

    const typedState = gameReducer(initialState, { type: 'type_letter', letter: 'K' })
    const afterBackspace = gameReducer(typedState, { type: 'backspace' })

    expect(typedState.rows).toEqual(['SLATE', 'SHARK', 'STORM', 'STACK', 'SMACK', 'SNACK'])
    expect(afterBackspace.rows).toEqual(['SLATE', 'SHARK', 'STORM', 'STACK', 'SMACK', 'SNAC'])
  })

  it('does not submit full guesses that are not in the dictionary', () => {
    const initialState = initializeGameState({ solution: 'STANK', maxGuesses: 6 })
    const nextState = dispatchMany(initialState, [
      { type: 'type_letter', letter: 'Q' },
      { type: 'type_letter', letter: 'Q' },
      { type: 'type_letter', letter: 'Q' },
      { type: 'type_letter', letter: 'Q' },
      { type: 'type_letter', letter: 'Q' },
      { type: 'submit_guess' },
    ])

    expect(nextState.rows).toEqual(['QQQQQ'])
  })

  it('submits full guesses that are in the dictionary', () => {
    const initialState = initializeGameState({ solution: 'STANK', maxGuesses: 6 })
    const nextState = dispatchMany(initialState, [
      { type: 'type_letter', letter: 'A' },
      { type: 'type_letter', letter: 'B' },
      { type: 'type_letter', letter: 'A' },
      { type: 'type_letter', letter: 'C' },
      { type: 'type_letter', letter: 'K' },
      { type: 'submit_guess' },
    ])

    expect(nextState.rows).toEqual(['ABACK', ''])
  })
})
