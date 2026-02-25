import { describe, expect, it } from 'vitest'
import { deriveEvaluatedRowsFromState } from './derive'
import type { GameState } from './types'

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    solution: 'STANK',
    rows: [''],
    maxGuesses: 6,
    ...overrides,
  }
}

describe('deriveEvaluatedRowsFromState', () => {
  it('returns one empty current row for initial state', () => {
    expect(deriveEvaluatedRowsFromState(makeState())).toEqual([
      [
        { letter: '', state: 'empty' },
        { letter: '', state: 'empty' },
        { letter: '', state: 'empty' },
        { letter: '', state: 'empty' },
        { letter: '', state: 'empty' },
      ],
    ])
  })

  it('evaluates submitted rows and keeps current row unevaluated', () => {
    expect(
      deriveEvaluatedRowsFromState(makeState({ rows: ['SLANT', 'STA'] })),
    ).toEqual([
      [
        { letter: 'S', state: 'correct' },
        { letter: 'L', state: 'absent' },
        { letter: 'A', state: 'correct' },
        { letter: 'N', state: 'correct' },
        { letter: 'T', state: 'present' },
      ],
      [
        { letter: 'S', state: 'empty' },
        { letter: 'T', state: 'empty' },
        { letter: 'A', state: 'empty' },
        { letter: '', state: 'empty' },
        { letter: '', state: 'empty' },
      ],
    ])
  })

  it('treats all rows as submitted when row count reaches maxGuesses', () => {
    const state = makeState({
      rows: ['SLANT', 'STAND', 'STACK', 'STORK', 'SHARK', 'SNACK', ''],
      maxGuesses: 6,
    })

    const rows = deriveEvaluatedRowsFromState(state)
    expect(rows).toHaveLength(6)
    expect(rows.every((row) => row.every((tile) => tile.state !== 'empty'))).toBe(true)
  })

  it('handles duplicate letters with Wordle rules', () => {
    const state = makeState({ solution: 'SHEEP', rows: ['PEEPS', ''] })

    expect(deriveEvaluatedRowsFromState(state)[0]).toEqual([
      { letter: 'P', state: 'present' },
      { letter: 'E', state: 'present' },
      { letter: 'E', state: 'correct' },
      { letter: 'P', state: 'absent' },
      { letter: 'S', state: 'present' },
    ])
  })

  it('returns an empty array for zero maxGuesses', () => {
    expect(deriveEvaluatedRowsFromState(makeState({ solution: '', rows: [''], maxGuesses: 0 }))).toEqual([])
  })
})
