import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PixelIcon from "../pixelIcon";

// End-of-round modal. `children` holds the results (score, speed, …).
const ShowScore = ({ title = "Song complete!", children, backTo, onRestart }) => {
  const againRef = useRef(null);
  useEffect(() => againRef.current?.focus(), []);

  return (
    <div className="px-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="px-modal__box px-panel">
        <PixelIcon name="trophy" size={72} />
        <h1 className="text-shadow">{title}</h1>
        {children}
        <div className="px-modal__actions">
          <Link to={backTo} className="px-btn px-btn--ghost">
            Back
          </Link>
          <button ref={againRef} className="px-btn px-btn--yellow" onClick={onRestart}>
            Play again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowScore;
