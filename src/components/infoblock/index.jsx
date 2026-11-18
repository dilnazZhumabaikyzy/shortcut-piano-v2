import { useEffect, useState } from "react";
import KeyCombo from "../keyCombo";

const FLASH_MS = 300;
const COMMENT_MS = 600;

// Dialog box with the shortcut to play, the hint (shown on hover),
// the progress bar and a short flash/comment after each judged key press.
const Infoblock = ({ command, progress, feedback, hintShown, onShowHint, onHideHint }) => {
  const [flash, setFlash] = useState("");
  const [comment, setComment] = useState(null);

  useEffect(() => {
    if (!feedback) return;
    setFlash(feedback.correct ? "is-correct" : "is-wrong");
    const flashTimer = setTimeout(() => setFlash(""), FLASH_MS);

    let commentTimer;
    if (feedback.comment) {
      setComment({ text: feedback.comment, correct: feedback.correct, id: feedback.id });
      commentTimer = setTimeout(() => setComment(null), COMMENT_MS);
    }
    return () => {
      clearTimeout(flashTimer);
      clearTimeout(commentTimer);
    };
  }, [feedback]);

  return (
    <div className={`infoblock px-panel ${flash}`}>
      {comment && (
        <div key={comment.id} className={`infoblock__comment ${comment.correct ? "" : "is-wrong"}`}>
          {comment.text}
        </div>
      )}
      <div className="infoblock__label">Play this shortcut</div>
      <div className="infoblock__body">
        <div className="infoblock__description">{command.description}</div>
        <div className="infoblock__hint" onMouseEnter={onShowHint} onMouseLeave={onHideHint}>
          {hintShown ? <KeyCombo keys={command.keys} /> : <span className="infoblock__hint-label">? Hint</span>}
        </div>
      </div>
      <div className="px-progress">
        <div className="px-progress__fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default Infoblock;
