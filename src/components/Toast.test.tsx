import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Toast } from './Toast'

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('auto-dismisses when not sticky', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()

    render(<Toast message="HELLO" durationMs={1200} onDismiss={onDismiss} />)
    expect(screen.getByRole('status')).toHaveTextContent('HELLO')

    vi.advanceTimersByTime(1199)
    expect(onDismiss).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not auto-dismiss when sticky', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()

    render(<Toast message="STICKY" sticky onDismiss={onDismiss} />)
    vi.advanceTimersByTime(10_000)
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
