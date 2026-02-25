import { describe, expect, it } from 'vitest'
import { deriveKeyboardStatesFromState } from './derive'
import type { GameState } from './types'

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    solution: 'STANK',
    rows: [''],
    maxGuesses: 6,
    ...overrides,
  }
}

describe('deriveKeyboardStatesFromState', () => {
  it('returns empty keyboard state for initial state', () => {
    expect(deriveKeyboardStatesFromState(makeState())).toEqual({})
  })

  it('ignores letters in current draft row', () => {
    expect(deriveKeyboardStatesFromState(makeState({ rows: ['STA'] }))).toEqual({})
  })

  it('derives keyboard states from one submitted guess', () => {
    expect(deriveKeyboardStatesFromState(makeState({ rows: ['SLANT', ''] }))).toEqual({
      S: 'correct',
      L: 'absent',
      A: 'correct',
      N: 'correct',
      T: 'present',
    })
  })

  it('keeps the strongest state for each key across guesses', () => {
    expect(
      deriveKeyboardStatesFromState(
        makeState({ solution: 'ABBEY', rows: ['TRAIL', 'ABACI', ''] }),
      ),
    ).toEqual({
      T: 'absent',
      R: 'absent',
      A: 'correct',
      I: 'absent',
      L: 'absent',
      B: 'correct',
      C: 'absent',
    })
  })

  it('treats rows as submitted when at maxGuesses', () => {
    expect(
      deriveKeyboardStatesFromState(
        makeState({ rows: ['SLANT', 'STAND', 'STACK', 'STORK', 'SHARK', 'SNACK'] }),
      ),
    ).toMatchObject({
      S: 'correct',
      T: 'correct',
      A: 'correct',
      N: 'correct',
      K: 'correct',
    })
  })

  it('normalizes lowercase guesses to uppercase keys', () => {
    expect(deriveKeyboardStatesFromState(makeState({ rows: ['slant', ''] }))).toMatchObject(
      {
        S: 'correct',
        L: 'absent',
      },
    )
  })
})
