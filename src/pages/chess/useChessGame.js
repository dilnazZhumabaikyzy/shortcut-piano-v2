import { Chess } from "chess.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeSan } from "../../modules/openings";
import { celebrate, playMistake, useSynth } from "../../sound";

const POINTS = 10;
const PENALTY = 10;
const STREAK_BONUS = { 4: { points: 30, comment: "Good! +30" }, 7: { points: 50, comment: "Great! +50" } };
const OPPONENT_DELAY_MS = 550;
// Characters that can appear in a typed move: e4, Nxf3+, O-O, e8=Q, 0-0, o-o.
const MOVE_CHAR = /^[a-h1-8NBRQKxOo0=+#-]$/;

const octaveDown = (pitch) => pitch.replace(/(\d)$/, (d) => String(Number(d) - 1));

function snapshot(chess) {
  return { board: chess.board(), turn: chess.turn() };
}

function initialState(chess) {
  return {
    ...snapshot(chess),
    ply: 0, // index in opening.moves of the next move
    buffer: "", // what the player has typed so far
    score: 0,
    streak: 0,
    lastMove: null, // { from, to }
    thinking: false, // opponent's reply is pending
    isEnd: false,
    hintShown: false,
    mistakes: 0, // wrong or non-book moves
    hintUsed: false,
    feedback: null, // { id, correct, comment }
  };
}

// One opening: the player types their side's moves in SAN; the other side's
// book replies are played automatically. Correct moves play the melody.
export function useChessGame(opening) {
  const chess = useRef(new Chess());
  const [state, setState] = useState(() => initialState(chess.current));
  const stateRef = useRef(state);
  const timer = useRef(null);
  const pressCount = useRef(0);
  const playerMoves = useRef(0);
  const playNote = useSynth();

  const update = useCallback((patch) => {
    stateRef.current = { ...stateRef.current, ...patch };
    setState(stateRef.current);
  }, []);

  const playBookMove = useCallback(
    (san) => {
      const move = chess.current.move(san);
      const ply = stateRef.current.ply + 1;
      const isEnd = ply >= opening.moves.length;
      update({ ...snapshot(chess.current), ply, isEnd, lastMove: { from: move.from, to: move.to } });
      if (isEnd) celebrate();
      return isEnd;
    },
    [opening, update]
  );

  const opponentMove = useCallback(() => {
    update({ thinking: true });
    timer.current = setTimeout(() => {
      const san = opening.moves[stateRef.current.ply];
      const pitch = opening.melody[Math.max(playerMoves.current - 1, 0) % opening.melody.length];
      playNote(octaveDown(pitch), "4n");
      playBookMove(san);
      update({ thinking: false });
    }, OPPONENT_DELAY_MS);
  }, [opening, playBookMove, playNote, update]);

  const restart = useCallback(() => {
    clearTimeout(timer.current);
    chess.current = new Chess();
    playerMoves.current = 0;
    stateRef.current = initialState(chess.current);
    setState(stateRef.current);
    if (opening.side === "b") opponentMove();
  }, [opening, opponentMove]);

  useEffect(() => {
    restart();
    return () => clearTimeout(timer.current);
  }, [restart]);

  // Judges a complete move. Returns nothing; updates score, board and feedback.
  const submit = useCallback(
    (typed) => {
      const current = stateRef.current;
      const id = ++pressCount.current;
      const expected = opening.moves[current.ply];
      const legal = chess.current.moves().map(normalizeSan);

      if (typed === normalizeSan(expected)) {
        playNote(opening.melody[playerMoves.current % opening.melody.length]);
        playerMoves.current += 1;
        const bonus = current.hintShown ? null : STREAK_BONUS[current.streak];
        const scored = current.hintShown
          ? { feedback: { id, correct: true } }
          : {
              score: current.score + (bonus?.points ?? POINTS),
              streak: current.streak + 1,
              feedback: { id, correct: true, comment: bonus?.comment ?? `+${POINTS}` },
            };
        update({ buffer: "", ...scored });
        const isEnd = playBookMove(expected);
        if (!isEnd) opponentMove();
        return;
      }

      playMistake();
      if (legal.includes(typed)) {
        update({
          buffer: "",
          streak: 0,
          mistakes: current.mistakes + 1,
          feedback: { id, correct: false, comment: "Not the book move" },
        });
      } else {
        update({
          buffer: "",
          streak: 0,
          mistakes: current.mistakes + 1,
          score: Math.max(0, current.score - PENALTY),
          feedback: { id, correct: false, comment: "Illegal move" },
        });
      }
    },
    [opening, opponentMove, playBookMove, playNote, update]
  );

  // Called after every keystroke: submits as soon as the typed text is a legal
  // move that no other legal move continues (O-O waits, since O-O-O may follow),
  // and rejects text that cannot become a legal move.
  const autoSubmit = useCallback(
    (buffer) => {
      const typed = normalizeSan(buffer);
      if (!typed) return;
      const legal = chess.current.moves().map(normalizeSan);
      const continuing = legal.filter((san) => san.startsWith(typed));
      if (continuing.length === 0) submit(typed);
      else if (continuing.length === 1 && continuing[0] === typed) submit(typed);
    },
    [submit]
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const current = stateRef.current;
      if (current.isEnd) return;

      if (event.key === "Backspace") {
        event.preventDefault();
        update({ buffer: current.buffer.slice(0, -1) });
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (current.buffer && !current.thinking) submit(normalizeSan(current.buffer));
      } else if (MOVE_CHAR.test(event.key)) {
        event.preventDefault();
        if (current.thinking) return;
        const buffer = current.buffer + event.key;
        update({ buffer });
        autoSubmit(buffer);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [autoSubmit, submit, update]);

  return {
    ...state,
    expected: opening.moves[Math.min(state.ply, opening.moves.length - 1)],
    restart,
    showHint: () => update({ hintShown: true, hintUsed: true, streak: 0 }),
    hideHint: () => update({ hintShown: false }),
  };
}
