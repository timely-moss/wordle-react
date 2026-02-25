import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { GameBoard } from './components/GameBoard'
import { Keyboard } from './components/Keyboard'
import { Toast } from './components/Toast'
import type { KeyboardKeyLabel } from './game/keys'
import { WORDLE_MERGED_DICTIONARY } from './game/wordlists/wordle-merged'
import {
  deriveGameBoardRowsFromState,
  deriveKeyboardStatesFromState,
} from './game/derive'
import { DEFAULT_MAX_GUESSES } from './game/config'
import { getDailySolution } from './game/daily-solution'
import { gameReducer, initializeGameState } from './game/reducer'
import { isGameLost } from './game/status'
import { validateSubmitGuess } from './game/submit-validation'

type InitializeAppGameStateParams = {
  maxGuesses: number
}

type StickyToastState = {
  kind: 'sticky'
  message: string
}

type TimedToastState = {
  kind: 'timed'
  message: string
  durationMs: number
}

type ToastState = StickyToastState | TimedToastState

function initializeAppGameState({
  maxGuesses,
}: InitializeAppGameStateParams) {
  return initializeGameState({
    solution: getDailySolution(WORDLE_MERGED_DICTIONARY),
    maxGuesses,
  })
}

function App() {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    { maxGuesses: DEFAULT_MAX_GUESSES },
    initializeAppGameState,
  )
  const gameStateRef = useRef(gameState)
  const [toast, setToast] = useState<ToastState | null>(null)

  const gameBoardRows = deriveGameBoardRowsFromState(gameState)
  const keyboardStates = deriveKeyboardStatesFromState(gameState)
  const hasLost = isGameLost(gameState)

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const attemptSubmitGuess = useCallback(() => {
    const submitValidation = validateSubmitGuess(gameStateRef.current)
    if (submitValidation === 'invalid_word') {
      setToast({
        kind: 'timed',
        message: 'Not in word list',
        durationMs: 2000,
      })
      return
    }

    if (submitValidation === 'ok') {
      dispatch({ type: 'submit_guess' })
    }
  }, [dispatch])

  function handleKeyPress(label: KeyboardKeyLabel) {
    if (label === 'ENTER') {
      attemptSubmitGuess()
      return
    }

    if (label === 'BACKSPACE') {
      dispatch({ type: 'backspace' })
      return
    }

    dispatch({ type: 'type_letter', letter: label })
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault()
        attemptSubmitGuess()
        return
      }

      if (event.key === 'Backspace') {
        event.preventDefault()
        dispatch({ type: 'backspace' })
        return
      }

      if (/^[a-z]$/i.test(event.key)) {
        dispatch({ type: 'type_letter', letter: event.key.toUpperCase() })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [attemptSubmitGuess])

  function dismissToast() {
    setToast(null)
  }

  return (
    <main className="min-h-screen bg-zinc-300 px-3 py-6 font-sans text-black">
      {hasLost ? (
        <Toast message={gameState.solution} sticky onDismiss={() => {}} />
      ) : toast ? (
        <Toast
          message={toast.message}
          sticky={toast.kind === 'sticky'}
          durationMs={toast.kind === 'timed' ? toast.durationMs : undefined}
          onDismiss={dismissToast}
        />
      ) : null}
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-6">
        <GameBoard rows={gameBoardRows} />
        <Keyboard keyStates={keyboardStates} onKeyPress={handleKeyPress} />
      </div>
    </main>
  )
}

export default App
