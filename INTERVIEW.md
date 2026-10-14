# Wordle Interview Exercise

This is a working Wordle-like game.

The purpose of the exercise is to explore and evolve an existing codebase.

Start by spending some time understanding the codebase and explaining how you think it works.

You may then choose one of the tasks below.

---

## How to Approach the Exercise

Start by spending some time understanding the codebase and explaining how you think it works.

After choosing a task, you may approach it in whatever way you find most useful: discussing an approach, sketching ideas, exploring the code, writing tests, making code changes, or some combination of these.

A complete implementation is not expected.

---

## Task Options

Choose whichever task interests you most.

### Add a Word

Add a new word to the game, so that players can guess it and it can come up as a daily puzzle. Prove that it works.

### Add Analytics and Observability

Pick two or three events that would tell us something useful about how the game is played or how it behaves. Decide where they belong and log them with `console.log()` (or a lightweight wrapper).

### Ensure Everyone Gets the Same Puzzle

Every player should get the same puzzle on a given day, wherever they are in the world. Players shouldn't be able to predict tomorrow's word from today's, and a word shouldn't come round again too soon.

### Persist the Current Puzzle Across Refresh

Players should be able to refresh the page and continue today's puzzle where they left off.

### Add Player Statistics

Add basic statistics such as:

- games played
- wins
- current and longest streak
- guess distribution

### Extract the Game Engine

We may want to reuse the game logic outside this React application, for example in a mobile app, or on a server that checks players' guesses.

### Add Free-Play Mode

In addition to the daily puzzle, players should be able to start new games freely, without affecting their daily puzzle.
