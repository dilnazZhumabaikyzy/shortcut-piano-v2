import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/header";
import Keyboard from "../../components/keyboard";
import { usePressedKeys } from "../../components/keyboard/usePressedKeys";
import ShowScore from "../../components/showScore";
import { getCompositions } from "../../modules/compositions";
import Stars from "../../components/stars";
import { recordTyping, useProgress } from "../../modules/progress";
import { randomTextIndex, typingTexts } from "../../modules/texts";
import "./index.css";
import { computeStats, useTypingGame } from "./useTypingGame";

const songs = getCompositions("basic", "gmail");

const melodyOf = (song) => song.noteOrder.map((noteIndex) => song.notes[noteIndex].play);

// Re-renders every `ms` while `active`, so live stats keep moving between keystrokes.
function useTicker(active, ms = 500) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(timer);
  }, [active, ms]);
  return now;
}

const Typing = () => {
  const [songId, setSongId] = useState(songs[0].id);
  const [textIndex, setTextIndex] = useState(() => randomTextIndex());
  const song = songs.find((s) => s.id === songId);
  const melody = useMemo(() => melodyOf(song), [song]);
  const text = typingTexts[textIndex];

  const game = useTypingGame(text, melody);
  const pressedKeys = usePressedKeys();
  const now = useTicker(game.startedAt !== null && !game.isEnd);
  const stats = computeStats(game, now);
  const { typing } = useProgress();

  // Save the result once when the text is finished.
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (!game.isEnd) return setResult(null);
    const { wpm, accuracy } = computeStats(game);
    // 3 stars at 98%+ accuracy, 2 at 90%+.
    const stars = accuracy >= 98 ? 3 : accuracy >= 90 ? 2 : 1;
    setResult({ stars, ...recordTyping({ wpm, accuracy }) });
    // Only on the transition to the end of the text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.isEnd]);

  // Shake the text box on every mistake.
  const [shake, setShake] = useState(false);
  useEffect(() => {
    if (!game.lastError) return;
    setShake(true);
    const timer = setTimeout(() => setShake(false), 300);
    return () => clearTimeout(timer);
  }, [game.lastError]);

  // Keep the cursor visible when the text is longer than the box.
  const cursorRef = useRef(null);
  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: "nearest" });
  }, [game.position]);

  const progress = (game.position / text.length) * 100;

  return (
    <div className="page">
      <Header />
      <div className="hud">
        <div className="hud__title">Fast typing</div>
        <div className="hud__stats">
          <div className="hud__stat">
            <span>Speed</span>
            <strong className="hud__value--yellow">{stats.wpm} wpm</strong>
          </div>
          <div className="hud__stat">
            <span>Accuracy</span>
            <strong className="hud__value--green">{stats.accuracy}%</strong>
          </div>
          <div className="hud__stat">
            <span>Best</span>
            <strong className="hud__value--pink">{typing.best ? `${typing.best.wpm} wpm` : "—"}</strong>
          </div>
          <div className="hud__stat">
            <span>Time</span>
            <strong>{stats.seconds}s</strong>
          </div>
        </div>
      </div>

      <div className="typing-controls">
        <div className="typing-controls__group" role="radiogroup" aria-label="Melody">
          <span className="px-label">Melody</span>
          {songs.map((s) => (
            <button
              key={s.id}
              role="radio"
              aria-checked={s.id === songId}
              className={`px-btn px-btn--small ${s.id === songId ? "px-btn--active" : "px-btn--ghost"}`}
              onClick={(e) => {
                e.currentTarget.blur();
                setSongId(s.id);
              }}
            >
              ♪ {s.title}
            </button>
          ))}
        </div>
        <button
          className="px-btn px-btn--small px-btn--cyan"
          onClick={(e) => {
            e.currentTarget.blur();
            setTextIndex((index) => randomTextIndex(index));
          }}
        >
          New text
        </button>
      </div>

      <div className={`typing-text px-panel ${shake ? "is-wrong" : ""}`}>
        <div className="typing-text__label">
          {game.startedAt === null ? (
            <>
              <span className="blink">▶</span> Start typing — every key plays a note
            </>
          ) : (
            <>♪ {song.title}</>
          )}
        </div>
        <div className="typing-text__scroll">
          <p>
            {[...text].map((char, index) => {
              const status =
                index < game.position
                  ? game.mistakes.includes(index)
                    ? "is-typed is-fixed"
                    : "is-typed"
                  : index === game.position
                  ? "is-current"
                  : "";
              return (
                <span
                  key={index}
                  className={`typing-char ${status}`}
                  ref={index === game.position ? cursorRef : null}
                >
                  {char}
                </span>
              );
            })}
          </p>
        </div>
        <div className="px-progress">
          <div className="px-progress__fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="typing__keyboard">
        <Keyboard pressedKeys={pressedKeys} />
      </div>

      {game.isEnd && result && (
        <ShowScore title="Text complete!" backTo="/" onRestart={game.restart}>
          <Stars count={result.stars} size={40} />
          {result.isRecord && <div className="record-badge">New best!</div>}
          <h2>
            <span className="hud__value--yellow">{stats.wpm} wpm</span> ·{" "}
            <span className="hud__value--green">{stats.accuracy}%</span> · {stats.seconds}s
          </h2>
        </ShowScore>
      )}
    </div>
  );
};

export default Typing;
