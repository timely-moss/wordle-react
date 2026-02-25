export type TileState = 'empty' | 'correct' | 'present' | 'absent'

export type KeyboardKeyState = 'correct' | 'present' | 'absent' | 'default'

export type GameTileData = {
  letter: string
  state: TileState
}

export type GameBoardRowData = GameTileData[]

export type KeyboardStatesData = Partial<Record<string, KeyboardKeyState>>

export type GameState = {
  solution: string
  rows: string[]
  maxGuesses: number
}

export type GameAction =
  | { type: 'type_letter'; letter: string }
  | { type: 'backspace' }
  | { type: 'submit_guess' }
