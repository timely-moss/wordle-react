import { describe, expect, it } from 'vitest'
import { getDailySolution } from './daily-solution'

const TEST_SOLUTIONS = ['ALPHA', 'BRAVO', 'CHARL', 'DELTA']

describe('getDailySolution', () => {
  it('returns a solution from the list', () => {
    expect(TEST_SOLUTIONS).toContain(getDailySolution(TEST_SOLUTIONS))
  })

  it('returns the same solution for the same date', () => {
    const date = new Date(2026, 0, 15)
    expect(getDailySolution(TEST_SOLUTIONS, date)).toBe(
      getDailySolution(TEST_SOLUTIONS, date),
    )
  })

  it('returns a different solution on the next day', () => {
    const today = new Date(2026, 0, 15)
    const tomorrow = new Date(2026, 0, 16)
    expect(getDailySolution(TEST_SOLUTIONS, today)).not.toBe(
      getDailySolution(TEST_SOLUTIONS, tomorrow),
    )
  })

  it('throws for an empty list', () => {
    expect(() => getDailySolution([])).toThrow('solutions list cannot be empty')
  })
})
