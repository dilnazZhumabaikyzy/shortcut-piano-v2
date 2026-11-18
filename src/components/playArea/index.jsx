import { useEffect, useState } from "react";
import { recordLevel, starsFor } from "../../modules/progress";
import Infoblock from "../infoblock";
import Keyboard from "../keyboard";
import ShowScore from "../showScore";
import Stars from "../stars";
import "./index.css";
import { useShortcutGame } from "./useShortcutGame";

const pad = (n, width) => String(n).padStart(width, "0");

const PlayArea = ({ song, platform, backTo, progressKey }) => {
  const game = useShortcutGame(song);
  const total = song.noteOrder.length;

  // Save the result once when the song ends.
  const [result, setResult] = useState(null);
  const { isEnd, score, mistakes, hintUsed } = game;
  useEffect(() => {
    if (!isEnd) return setResult(null);
    const stars = starsFor({ mistakes, hintUsed });
    setResult({ stars, ...recordLevel(progressKey, { score, stars }) });
    // Only on the transition to the end of the song.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnd]);

  return (
    <div className="play">
      <div className="hud">
        <div className="hud__title">{song.title}</div>
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
            <span>Note</span>
            <strong>
              {pad(Math.min(game.position + 1, total), 2)}/{total}
            </strong>
          </div>
        </div>
      </div>

      <Infoblock
        command={song.commands[game.currentNote]}
        progress={game.progress}
        feedback={game.feedback}
        hintShown={game.hintShown}
        onShowHint={game.showHint}
        onHideHint={game.hideHint}
      />

      <div className="play__keyboard">
        <Keyboard pressedKeys={game.pressedKeys} platform={platform} />
      </div>

      {game.isEnd && result && (
        <ShowScore backTo={backTo} onRestart={game.restart}>
          <Stars count={result.stars} size={40} />
          {result.isRecord && <div className="record-badge">New best!</div>}
          <h2>
            Score: <span className="hud__value--yellow">{game.score}</span>
          </h2>
        </ShowScore>
      )}
    </div>
  );
};

export default PlayArea;
