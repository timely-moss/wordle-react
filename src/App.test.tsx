import { fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { getDailySolution } from './game/daily-solution'
import { WORDLE_MERGED_DICTIONARY } from './game/wordlists/wordle-merged'

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders the board and keyboard', () => {
    render(<App />)
    expect(screen.getByLabelText('game-board')).toBeInTheDocument()
    expect(screen.getByLabelText('keyboard')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument()
  })

  it('types a letter from the on-screen keyboard', () => {
    render(<App />)
    expect(screen.queryByLabelText('tile-S')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    expect(screen.getByLabelText('tile-S')).toBeInTheDocument()
  })

  it('types a letter from physical keyboard input', () => {
    render(<App />)
    expect(screen.queryByLabelText('tile-S')).not.toBeInTheDocument()
    fireEvent.keyDown(window, { key: 's' })
    expect(screen.getByLabelText('tile-S')).toBeInTheDocument()
  })

  it('shows a sticky toast with the correct word after the last attempt', () => {
    render(<App />)

    for (let attempt = 0; attempt < 6; attempt += 1) {
      for (const letter of 'ABASE') {
        fireEvent.keyDown(window, { key: letter })
      }
      fireEvent.keyDown(window, { key: 'Enter' })
    }

    const expectedSolution = getDailySolution(WORDLE_MERGED_DICTIONARY)

    expect(screen.getByRole('status')).toHaveTextContent(expectedSolution)
  })

  it('shows and auto-dismisses the invalid word toast after 2 seconds', () => {
    vi.useFakeTimers()
    render(<App />)

    for (const letter of 'QQQQQ') {
      fireEvent.keyDown(window, { key: letter })
    }
    fireEvent.keyDown(window, { key: 'Enter' })

    expect(screen.getByRole('status')).toHaveTextContent('Not in word list')
    expect(screen.getAllByLabelText('tile-Q')).toHaveLength(5)

    fireEvent.keyDown(window, { key: 'Backspace' })
    expect(screen.getAllByLabelText('tile-Q')).toHaveLength(4)

    act(() => {
      vi.advanceTimersByTime(1999)
    })
    expect(screen.getByRole('status')).toHaveTextContent('Not in word list')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('does not show invalid word toast for dictionary words', () => {
    render(<App />)

    for (const letter of 'ABACK') {
      fireEvent.keyDown(window, { key: letter })
    }
    fireEvent.keyDown(window, { key: 'Enter' })

    expect(screen.queryByText('Not in word list')).not.toBeInTheDocument()
  })
})
