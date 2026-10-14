# Wordle

A Wordle-like word puzzle game built with React and TypeScript.

## About

The game selects a 5-letter puzzle based on the player's local calendar date. Players get six guesses. Tiles and keyboard keys reflect correct, present, and absent letters after each guess.

## Development

```bash
bun install
bun dev
```

Run tests:

```bash
bun run test
```

Other checks:

```bash
bun run typecheck
bun run lint
```

## How the app is structured

The game rules are plain TypeScript in `src/game/` and don't depend on React. The components in `src/components/` only display what they're given. `src/App.tsx` connects the two: it holds the game state, listens for key presses and shows messages.

### Data flow

```
key press (on-screen keyboard or physical keyboard)
  → App dispatches an action: type_letter | backspace | submit_guess
  → gameReducer returns the next GameState
  → App derives the board tiles and keyboard colours from that state
  → GameBoard and Keyboard render them
```

Only the minimum is stored. Tile colours, keyboard colours and whether the game is won or lost are worked out from the state on every render.

When the player presses Enter, `App` first calls `validateSubmitGuess` so it can show "Not in word list" when needed. The reducer runs the same check and ignores a guess that fails it.

### Game state

```ts
type GameState = {
  solution: string
  rows: string[]
  maxGuesses: number
}
```

`rows` holds the submitted guesses, followed by the guess currently being typed. After the last guess is submitted, an empty row is appended, so `rows.length > maxGuesses` means no guesses remain. The helpers in `row-semantics.ts` (`getSubmittedRows`, `getCurrentRow` and so on) interpret this for you.

### Where things are

| Path | What it does |
| --- | --- |
| `src/App.tsx` | Holds the state, handles keyboard input and shows messages |
| `src/game/types.ts` | `GameState`, `GameAction` and the tile and key types |
| `src/game/reducer.ts` | Creates the initial state and applies actions to it |
| `src/game/row-semantics.ts` | Reads the submitted rows and the current row from `rows` |
| `src/game/submit-validation.ts` | Decides whether the current guess can be submitted |
| `src/game/status.ts` | Won, lost and finished checks |
| `src/game/derive.ts` | Works out tile and keyboard colours from the state |
| `src/game/daily-solution.ts` | Picks the puzzle for a given date |
| `src/game/dictionary.ts`, `src/game/wordlists/` | The word list and the check for whether a guess is a word |
| `src/game/keys.ts`, `src/game/config.ts` | Keyboard layout and the number of guesses |
| `src/components/` | Board, tiles, keyboard, keys and the toast message |

### Tests

Tests use Vitest and sit next to the code they cover (`*.test.ts` and `*.test.tsx`). The game logic is tested directly as plain functions. `App.test.tsx` plays through the game from the UI.
