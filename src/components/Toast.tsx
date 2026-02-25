import { useEffect } from 'react'

type ToastProps = {
  message: string
  sticky?: boolean
  durationMs?: number
  onDismiss: () => void
}

export function Toast({
  message,
  sticky = false,
  durationMs = 2500,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    if (sticky) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss()
    }, durationMs)

    return () => window.clearTimeout(timeoutId)
  }, [sticky, durationMs, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed top-8 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-900 px-6 py-4 text-4xl font-bold text-white shadow-lg"
    >
      {message}
    </div>
  )
}
