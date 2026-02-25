import { describe, expect, it } from 'vitest'
import { deriveGameBoardRowsFromState } from './derive'
import type { GameBoardRowData, GameState } from './types'

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    solution: 'STANK',
    rows: [''],
    maxGuesses: 6,
    ...overrides,
  }
}

function emptyBoard(rows: number, wordLength: number): GameBoardRowData[] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: wordLength }, () => ({ letter: '', state: 'empty' as const })),
  )
}

describe('deriveGameBoardRowsFromState', () => {
  it('derives a full matrix of empty tiles from the initial game state', () => {
    expect(deriveGameBoardRowsFromState(makeState())).toEqual(emptyBoard(6, 5))
  })

  it('uses solution length for row width and maxGuesses for row count', () => {
    expect(
      deriveGameBoardRowsFromState(
        makeState({ solution: 'WORD', rows: [''], maxGuesses: 3 }),
      ),
    ).toEqual(emptyBoard(3, 4))
  })

  it('shows typed letters on the current row without evaluating them', () => {
    expect(deriveGameBoardRowsFromState(makeState({ rows: ['STA'] }))).toEqual([
      [
        { letter: 'S', state: 'empty' },
        { letter: 'T', state: 'empty' },
        { letter: 'A', state: 'empty' },
        { letter: '', state: 'empty' },
        { letter: '', state: 'empty' },
      ],
      ...emptyBoard(5, 5),
    ])
  })

  it('evaluates one submitted row against the solution', () => {
    expect(deriveGameBoardRowsFromState(makeState({ rows: ['SLANT', ''] }))).toEqual([
      [
        { letter: 'S', state: 'correct' },
        { letter: 'L', state: 'absent' },
        { letter: 'A', state: 'correct' },
        { letter: 'N', state: 'correct' },
        { letter: 'T', state: 'present' },
      ],
      ...emptyBoard(5, 5),
    ])
  })

  it('evaluates submitted rows and keeps the final row as current draft', () => {
    expect(
      deriveGameBoardRowsFromState(makeState({ rows: ['SLANT', 'STAND', 'STA'] })),
    ).toEqual([
      [
        { letter: 'S', state: 'correct' },
        { letter: 'L', state: 'absent' },
        { letter: 'A', state: 'correct' },
        { letter: 'N', state: 'correct' },
        { letter: 'T', state: 'present' },
      ],
      [
        { letter: 'S', state: 'correct' },
        { letter: 'T', state: 'correct' },
        { letter: 'A', state: 'correct' },
        { letter: 'N', state: 'correct' },
        { letter: 'D', state: 'absent' },
      ],
      [
        { letter: 'S', state: 'empty' },
        { letter: 'T', state: 'empty' },
        { letter: 'A', state: 'empty' },
        { letter: '', state: 'empty' },
        { letter: '', state: 'empty' },
      ],
      ...emptyBoard(3, 5),
    ])
  })

  it('marks a winning submitted row as all correct', () => {
    expect(deriveGameBoardRowsFromState(makeState({ rows: ['STANK', ''] }))).toEqual([
      [
        { letter: 'S', state: 'correct' },
        { letter: 'T', state: 'correct' },
        { letter: 'A', state: 'correct' },
        { letter: 'N', state: 'correct' },
        { letter: 'K', state: 'correct' },
      ],
      ...emptyBoard(5, 5),
    ])
  })

  it('does not add an extra empty row when rows are already at maxGuesses', () => {
    const rows = ['SLANT', 'STAND', 'STACK', 'STORK', 'SHARK', 'SNACK']

    expect(
      deriveGameBoardRowsFromState(makeState({ rows, maxGuesses: 6 })).length,
    ).toBe(6)
  })

  it('ignores extra letters beyond the solution length', () => {
    expect(deriveGameBoardRowsFromState(makeState({ rows: ['STANKX', ''] }))[0]).toEqual(
      [
        { letter: 'S', state: 'correct' },
        { letter: 'T', state: 'correct' },
        { letter: 'A', state: 'correct' },
        { letter: 'N', state: 'correct' },
        { letter: 'K', state: 'correct' },
      ],
    )
  })

  it('pads short rows with empty tiles', () => {
    expect(deriveGameBoardRowsFromState(makeState({ rows: ['ST'] }))[0]).toEqual([
      { letter: 'S', state: 'empty' },
      { letter: 'T', state: 'empty' },
      { letter: '', state: 'empty' },
      { letter: '', state: 'empty' },
      { letter: '', state: 'empty' },
    ])
  })

  it('normalizes letters to uppercase for rendering', () => {
    expect(deriveGameBoardRowsFromState(makeState({ rows: ['slant', ''] }))[0]).toEqual([
      { letter: 'S', state: 'correct' },
      { letter: 'L', state: 'absent' },
      { letter: 'A', state: 'correct' },
      { letter: 'N', state: 'correct' },
      { letter: 'T', state: 'present' },
    ])
  })

  it('handles duplicate letters with Wordle-style evaluation', () => {
    const duplicateState = makeState({ solution: 'SHEEP', rows: ['PEEPS', ''] })

    expect(deriveGameBoardRowsFromState(duplicateState)[0]).toEqual([
      { letter: 'P', state: 'present' },
      { letter: 'E', state: 'present' },
      { letter: 'E', state: 'correct' },
      { letter: 'P', state: 'absent' },
      { letter: 'S', state: 'present' },
    ])
  })

  it('returns an empty array when solution is empty and maxGuesses is zero', () => {
    expect(deriveGameBoardRowsFromState(makeState({ solution: '', rows: [''], maxGuesses: 0 }))).toEqual([])
  })

  it('does not mutate the input state', () => {
    const gameState = makeState({ rows: ['SLANT', 'STA'] })
    const snapshot = structuredClone(gameState)

    deriveGameBoardRowsFromState(gameState)

    expect(gameState).toEqual(snapshot)
  })
})
