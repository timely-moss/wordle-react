import { Key } from './Key'
import { KEYBOARD_ROWS } from '../game/keys'
import type { KeyboardKeyLabel } from '../game/keys'
import type { KeyboardStatesData } from '../game/types'

type KeyboardProps = {
  keyStates: KeyboardStatesData
  onKeyPress: (label: KeyboardKeyLabel) => void
}

export function Keyboard({ keyStates, onKeyPress }: KeyboardProps) {
  return (
    <section aria-label="keyboard" className="w-full max-w-[700px] space-y-2">
      {KEYBOARD_ROWS.map((row, index) => (
        <div key={index} className="flex justify-center gap-2">
          {row.map((key) => (
            <Key
              key={key}
              label={key}
              wide={key === 'ENTER' || key === 'BACKSPACE'}
              state={keyStates[key] ?? 'default'}
              onPress={onKeyPress}
            />
          ))}
        </div>
      ))}
    </section>
  )
}
