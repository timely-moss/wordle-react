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

- `src/game/`: the game rules, in plain TypeScript with no React
- `src/components/`: components that display the board, the keyboard and messages
- `src/App.tsx`: connects the two, holding the game state and handling input

Key presses become actions (`type_letter`, `backspace`, `submit_guess`) that a reducer applies to the game state. Everything on screen is worked out from that state.

One thing that isn't obvious: `rows` in the game state holds the submitted guesses followed by the guess being typed. The helpers in `row-semantics.ts` read it for you.

Tests sit next to the code they cover.
