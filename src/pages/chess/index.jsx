import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import KeyCombo from "../../components/keyCombo";
import PixelIcon from "../../components/pixelIcon";
import ShowScore from "../../components/showScore";
import Stars from "../../components/stars";
import { getOpening, OPENINGS, playerMoveCount } from "../../modules/openings";
import { chessKey, recordLevel, starsFor, summarize, useProgress } from "../../modules/progress";
import "../compositions/index.css";
import Board from "./Board";
import "./index.css";
import { useChessGame } from "./useChessGame";

const SIDE_NAMES = { w: "White", b: "Black" };
const pad = (n, width) => String(n).padStart(width, "0");

// "1. e4 e5 2. Nf3 Nc6 …" with the moves already played marked.
const MoveList = ({ moves, ply }) => (
  <ol className="moves">
    {moves.map((san, i) => (
      <li key={i} className={`moves__item ${i < ply ? "is-played" : ""} ${i === ply ? "is-next" : ""}`}>
        {i % 2 === 0 && <span className="moves__number">{i / 2 + 1}.</span>}
        {i < ply ? san : "···"}
      </li>
    ))}
  </ol>
);

export const ChessMenu = () => {
  const { levels } = useProgress();
  const total = summarize(
    levels,
    OPENINGS.map((o) => chessKey(o.id))
  );
  return (
    <div className="page">
      <Header />
      <div className="levels__head">
        <h1 className="levels__title text-shadow">Chess · Openings</h1>
        <div className="levels__stars px-panel" title="Stars collected">
          <PixelIcon name="star" size={24} />
          <span>
            {total.stars}/{total.maxStars}
          </span>
        </div>
      </div>
      <p className="chess-intro">
        Type your moves in algebraic notation: <kbd className="px-keycap">e4</kbd>{" "}
        <kbd className="px-keycap">Nf3</kbd> <kbd className="px-keycap">O-O</kbd>. Capital letters are pieces,
        lowercase are files; <b>x</b> and <b>+</b> are optional. Every book move plays the next note.
      </p>
      <ol className="levels">
        {OPENINGS.map((opening, index) => {
          const result = levels[chessKey(opening.id)];
          return (
            <li key={opening.id} className={`level px-panel ${result ? "is-done" : ""}`}>
              <div className="level__number">{pad(index + 1, 2)}</div>
              <PixelIcon name={opening.side === "w" ? "wn" : "bn"} size={48} />
              <div className="level__text">
                <h2>{opening.title}</h2>
                <p>
                  {opening.description}
                  {result && <span className="level__best"> · Best {result.best}</span>}
                </p>
              </div>
              <div className="chess-side">
                Play {SIDE_NAMES[opening.side]} · {playerMoveCount(opening)} moves
              </div>
              <Stars count={result?.stars ?? 0} />
              <Link to={`/chess/${opening.id}`} className="px-btn px-btn--small">
                {result ? "Replay" : "Play"}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export const ChessPlay = () => {
  const { openingId } = useParams();
  const opening = getOpening(openingId);
  if (!opening) return <Navigate to="/chess" replace />;
  return <ChessGame key={opening.id} opening={opening} />;
};

const ChessGame = ({ opening }) => {
  const game = useChessGame(opening);
  const total = playerMoveCount(opening);
  const done = opening.moves
    .slice(0, game.ply)
    .filter((_, i) => (i % 2 === 0 ? "w" : "b") === opening.side).length;
  const myTurn = game.turn === opening.side && !game.isEnd;

  // Save the result once when the opening is finished.
  const [result, setResult] = useState(null);
  const { isEnd, score, mistakes, hintUsed } = game;
  useEffect(() => {
    if (!isEnd) return setResult(null);
    const stars = starsFor({ mistakes, hintUsed });
    setResult({ stars, ...recordLevel(chessKey(opening.id), { score, stars }) });
    // Only on the transition to the end of the opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnd]);

  // Flash + floating comment after each judged move.
  const [flash, setFlash] = useState("");
  const [comment, setComment] = useState(null);
  useEffect(() => {
    const feedback = game.feedback;
    if (!feedback) return;
    setFlash(feedback.correct ? "is-correct" : "is-wrong");
    if (feedback.comment) setComment(feedback);
    const timers = [setTimeout(() => setFlash(""), 300), setTimeout(() => setComment(null), 700)];
    return () => timers.forEach(clearTimeout);
  }, [game.feedback]);

  return (
    <div className="page">
      <Header />
      <div className="hud">
        <div className="hud__title">{opening.title}</div>
        <div className="hud__stats">
          <div className="hud__stat">
            <span>Score</span>
            <strong className="hud__value--yellow">{pad(game.score, 5)}</strong>
          </div>
          <div className="hud__stat">
            <span>Streak</span>
            <strong className="hud__value--pink">x{game.streak}</strong>
          </div>
          <div className="hud__stat">
            <span>Move</span>
            <strong>
              {pad(Math.min(done + 1, total), 2)}/{total}
            </strong>
          </div>
        </div>
      </div>

      <div className="chess">
        <Board board={game.board} orientation={opening.side} lastMove={game.lastMove} />

        <div className={`chess-panel px-panel ${flash}`}>
          {comment && (
            <div key={comment.id} className={`chess-panel__comment ${comment.correct ? "" : "is-wrong"}`}>
              {comment.comment}
            </div>
          )}
          <div className="infoblock__label">
            {myTurn
              ? `Your move · ${SIDE_NAMES[opening.side]}`
              : game.isEnd
              ? "Done"
              : "Opponent is thinking…"}
          </div>
          <p className="chess-panel__description">{opening.description}</p>

          <div className={`chess-input ${myTurn ? "" : "is-waiting"}`}>
            <span className="chess-input__prompt">&gt;</span>
            <span className="chess-input__text">{game.buffer}</span>
            <span className="chess-input__cursor blink">█</span>
          </div>
          <div className="chess-panel__help">Enter — submit · Backspace — erase</div>

          <div className="chess-panel__row">
            <div className="infoblock__hint" onMouseEnter={game.showHint} onMouseLeave={game.hideHint}>
              {game.hintShown && myTurn ? (
                <KeyCombo keys={[game.expected]} />
              ) : (
                <span className="infoblock__hint-label">? Hint</span>
              )}
            </div>
          </div>

          <MoveList moves={opening.moves} ply={game.ply} />

          <div className="px-progress">
            <div className="px-progress__fill" style={{ width: `${(done / total) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {game.isEnd && result && (
        <ShowScore title="Opening learned!" backTo="/chess" onRestart={game.restart}>
          <Stars count={result.stars} size={40} />
          {result.isRecord && <div className="record-badge">New best!</div>}
          <h2>
            {opening.title} · Score: <span className="hud__value--yellow">{game.score}</span>
          </h2>
        </ShowScore>
      )}
    </div>
  );
};
