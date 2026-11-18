import { useCallback, useEffect, useRef, useState } from "react";
import { celebrate, playMistake, useSynth } from "../../sound";

const initialState = {
  position: 0, // index of the next character to type
  keystrokes: 0, // all judged key presses, right or wrong
  mistakes: [], // positions where a wrong key was pressed at least once
  startedAt: null,
  finishedAt: null,
  lastError: null, // { id } — changes on every mistake, drives the shake animation
};

const CHARS_PER_WORD = 5;

export function computeStats(state, now = Date.now()) {
  // `now` comes from a ticker and can be older than the first keystroke.
  const end = state.finishedAt ?? Math.max(now, state.startedAt ?? 0);
  const minutes = state.startedAt ? (end - state.startedAt) / 60000 : 0;
  const correct = state.position;
  return {
    seconds: Math.floor(minutes * 60),
    wpm: minutes > 0 ? Math.round(correct / CHARS_PER_WORD / minutes) : 0,
    accuracy: state.keystrokes ? Math.round((correct / state.keystrokes) * 100) : 100,
  };
}

// Typing round: every correct character plays the next note of `melody`
// (an array of pitches, looped); a wrong one plays the mistake sound.
export function useTypingGame(text, melody) {
  const [state, setState] = useState(initialState);
  // Source of truth for the key handler; keystrokes can outpace re-renders.
  const stateRef = useRef(initialState);
  const playNote = useSynth();

  const update = useCallback((next) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const restart = useCallback(() => update(initialState), [update]);

  // New text or melody → new round.
  useEffect(() => restart(), [text, melody, restart]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1) return; // Shift, Tab, arrows, …
      event.preventDefault(); // Space would scroll the page.

      const current = stateRef.current;
      if (current.finishedAt || current.position >= text.length) return;

      const now = Date.now();
      const startedAt = current.startedAt ?? now;
      const keystrokes = current.keystrokes + 1;

      if (event.key === text[current.position]) {
        playNote(melody[current.position % melody.length]);
        const position = current.position + 1;
        const finished = position === text.length;
        if (finished) celebrate();
        update({ ...current, position, keystrokes, startedAt, finishedAt: finished ? now : null });
      } else {
        playMistake();
        const mistakes = current.mistakes.includes(current.position)
          ? current.mistakes
          : [...current.mistakes, current.position];
        update({ ...current, keystrokes, startedAt, mistakes, lastError: { id: keystrokes } });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [text, melody, playNote, update]);

  return { ...state, isEnd: state.finishedAt !== null, restart };
}
