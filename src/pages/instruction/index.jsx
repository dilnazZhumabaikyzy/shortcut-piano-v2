import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import KeyCombo from "../../components/keyCombo";
import { getComposition } from "../../modules/compositions";
import "./index.css";

const Instruction = () => {
  const { category, app, songId } = useParams();
  const song = getComposition(category, app, songId);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  if (!song) return <Navigate to={`/compositions/${category}/${app}`} replace />;

  return (
    <div className="page">
      <Header />
      <div className="briefing__head">
        <div>
          <p className="briefing__eyebrow">Level briefing · {song.title}</p>
          <h1 className="briefing__title text-shadow">Memorize these shortcuts</h1>
        </div>
        <Link to={`/play/${category}/${app}/${song.id}`} className="px-btn px-btn--yellow">
          <span className="blink">▶</span> Start
        </Link>
      </div>

      <ul className="briefing">
        {song.commands.map((command, index) => (
          <li className="briefing__card px-panel" key={command.description}>
            <span className="briefing__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="briefing__description">{command.description}</span>
            <KeyCombo keys={command.keys} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Instruction;
