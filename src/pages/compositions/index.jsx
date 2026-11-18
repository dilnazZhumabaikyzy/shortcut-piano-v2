import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header";
import PixelIcon from "../../components/pixelIcon";
import Stars from "../../components/stars";
import { getApp, getCompositions } from "../../modules/compositions";
import { shortcutKey, summarize, useProgress } from "../../modules/progress";
import "./index.css";

const Compositions = () => {
  const { category, app } = useParams();
  const songs = getCompositions(category, app);
  const { levels } = useProgress();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const heading = `${getApp(app).title} · ${category}`;

  if (!songs) {
    return (
      <div className="page">
        <Header />
        <div className="soon px-panel">
          <PixelIcon name="lock" size={64} />
          <h1 className="text-shadow">{heading}</h1>
          <p>
            This world is still being built. <span className="blink">_</span>
          </p>
          <Link to="/shortcuts" className="px-btn px-btn--cyan">
            Back to shortcuts
          </Link>
        </div>
      </div>
    );
  }

  const keys = songs.map((song) => shortcutKey(category, app, song.id));
  const total = summarize(levels, keys);

  return (
    <div className="page">
      <Header />
      <div className="levels__head">
        <h1 className="levels__title text-shadow">{heading}</h1>
        <div className="levels__stars px-panel" title="Stars collected">
          <PixelIcon name="star" size={24} />
          <span>
            {total.stars}/{total.maxStars}
          </span>
        </div>
      </div>

      <ol className="levels">
        {songs.map((song, index) => {
          const result = levels[keys[index]];
          return (
            <li key={song.id} className={`level px-panel ${result ? "is-done" : ""}`}>
              <div className="level__number">{String(index + 1).padStart(2, "0")}</div>
              <PixelIcon name="note" size={48} />
              <div className="level__text">
                <h2>{song.title}</h2>
                <p>
                  {song.description}
                  {result && <span className="level__best"> · Best {result.best}</span>}
                </p>
              </div>
              <Stars count={result?.stars ?? 0} />
              <Link to={`/instruction/${category}/${app}/${song.id}`} className="px-btn px-btn--small">
                {result ? "Replay" : "Play"}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Compositions;
