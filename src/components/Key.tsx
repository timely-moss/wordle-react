import type { KeyboardKeyLabel } from '../game/keys'
import type { KeyboardKeyState } from '../game/types'

const keyStyles: Record<KeyboardKeyState, string> = {
  default: 'bg-zinc-400 text-black',
  correct: 'bg-green-600 text-white',
  present: 'bg-yellow-600 text-white',
  absent: 'bg-zinc-500 text-white',
}

type KeyProps = {
  label: KeyboardKeyLabel
  state?: KeyboardKeyState
  wide?: boolean
  onPress: (label: KeyboardKeyLabel) => void
}

function BackspaceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-7 w-7 stroke-current"
      fill="none"
      strokeWidth="2"
    >
      <path d="M21 5H9.3L3 12l6.3 7H21a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z" />
      <path d="m16 9-4 6" />
      <path d="m12 9 4 6" />
    </svg>
  )
}

export function Key({ label, state = 'default', wide = false, onPress }: KeyProps) {
  const isBackspace = label === 'BACKSPACE'

  return (
    <button
      type="button"
      onClick={() => onPress(label)}
      className={`flex h-14 items-center justify-center rounded-md px-2 font-bold uppercase transition-colors select-none ${wide ? 'min-w-18 text-[1.05rem]' : 'w-14 text-[2rem]'} ${keyStyles[state]}`}
      aria-label={isBackspace ? 'backspace' : label}
    >
      {isBackspace ? <BackspaceIcon /> : label}
    </button>
  )
}
