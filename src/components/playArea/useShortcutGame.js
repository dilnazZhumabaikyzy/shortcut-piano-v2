import { useCallback, useEffect, useReducer, useRef } from "react";
import { findKey } from "../keyboard/layout";
import { usePressedKeys } from "../keyboard/usePressedKeys";
import { matchShortcut } from "../../modules/combo";
import { celebrate, playMistake, useSynth } from "../../sound";

const POINTS = 10;
const PENALTY = 10;
// Bonus replacing the regular points when the streak of correct notes
// (played without the hint) reaches this length.
const STREAK_BONUS = { 4: { points: 30, comment: "Good! +30" }, 7: { points: 50, comment: "Great! +50" } };
// The progress bar fills up to this width (%) at the end of the song.
const PROGRESS_MAX = 100;

const initialState = {
  position: 0, // index in song.noteOrder of the note to play next
  score: 0,
  streak: 0,
  progress: 0,
  isEnd: false,
  hintShown: false,
  mistakes: 0,
  hintUsed: false,
  // Changes on every judged key press; drives the infoblock flash and comment.
  feedback: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "correct": {
      const position = state.position + 1;
      const isEnd = position >= action.length;
      const progress = state.progress + PROGRESS_MAX / action.length;

      if (state.hintShown) {
        return { ...state, position, isEnd, progress, feedback: { id: action.id, correct: true } };
      }
      const bonus = STREAK_BONUS[state.streak];
      return {
        ...state,
        position,
        isEnd,
        progress,
        score: state.score + (bonus?.points ?? POINTS),
        streak: state.streak + 1,
        feedback: { id: action.id, correct: true, comment: bonus?.comment ?? `+${POINTS}` },
      };
    }
    case "wrong":
      return {
        ...state,
        score: Math.max(0, state.score - PENALTY),
        mistakes: state.mistakes + 1,
        streak: 0,
        progress: 0,
        feedback: { id: action.id, correct: false, comment: "Try again!" },
      };
    case "showHint":
      return { ...state, hintShown: true, hintUsed: true, streak: 0 };
    case "hideHint":
      return { ...state, hintShown: false };
    case "restart":
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// Runs one song: listens to the keyboard, judges key presses against the
// expected note, plays sounds and keeps score.
export function useShortcutGame(song) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const pressedKeys = usePressedKeys();
  const playNote = useSynth();

  const stateRef = useRef(state);
  stateRef.current = state;
  const pressCount = useRef(0);

  const judge = useCallback(
    (event) => {
      const { position, isEnd } = stateRef.current;
      if (isEnd) return;

      const note = song.notes[song.noteOrder[position]];
      const result = matchShortcut(note.code, event);
      if (result === null) return;

      const id = ++pressCount.current;
      if (result) {
        playNote(note.play);
        dispatch({ type: "correct", length: song.noteOrder.length, id });
        // Advance the ref now: the next keydown may arrive before React re-renders.
        const next = position + 1;
        stateRef.current = { ...stateRef.current, position: next, isEnd: next >= song.noteOrder.length };
        if (next >= song.noteOrder.length) celebrate();
      } else {
        playMistake();
        dispatch({ type: "wrong", id });
      }
    },
    [song, playNote]
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      // Keep browser shortcuts (Ctrl+S, Cmd+P, F5, …) from firing while playing.
      event.preventDefault();
      if (event.repeat) return;
      if (findKey(event)) judge(event);
    };
    const onKeyUp = (event) => event.preventDefault();

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [judge]);

  const currentNote = song.noteOrder[Math.min(state.position, song.noteOrder.length - 1)];

  return {
    ...state,
    currentNote,
    pressedKeys,
    showHint: () => dispatch({ type: "showHint" }),
    hideHint: () => dispatch({ type: "hideHint" }),
    restart: () => dispatch({ type: "restart" }),
  };
}
