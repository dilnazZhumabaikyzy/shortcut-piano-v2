import { Link } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import PixelIcon from "../../components/pixelIcon";
import { OPENINGS } from "../../modules/openings";
import { chessKey, resetProgress, summarize, useProgress } from "../../modules/progress";
import { typingTexts } from "../../modules/texts";
import { SHORTCUT_APPS } from "../shortcuts";
import "./index.css";

const shortcutKeys = SHORTCUT_APPS.flatMap((app) => app.progressKeys);
const chessKeys = OPENINGS.map((opening) => chessKey(opening.id));

const CATEGORIES = [
  {
    id: "shortcuts",
    to: "/shortcuts",
    title: "Shortcuts",
    icon: "command",
    accent: "cyan",
    text: "Every shortcut is a note. Press them in the right order and the song plays itself.",
    tags: SHORTCUT_APPS.map((app) => app.title),
    stat: `${SHORTCUT_APPS.length} apps · ${shortcutKeys.length} songs`,
    progress: (p) => summaryLine(summarize(p.levels, shortcutKeys)),
  },
  {
    id: "typing",
    to: "/typing",
    title: "Fast typing",
    icon: "keys",
    accent: "green",
    text: "Type a text as fast as you can. Every correct letter plays the next note of a melody.",
    tags: ["WPM", "Accuracy", "3 melodies"],
    stat: `${typingTexts.length} texts`,
    progress: (p) => (p.typing.best ? `Best ${p.typing.best.wpm} wpm` : "Not played yet"),
  },
  {
    id: "chess",
    to: "/chess",
    title: "Chess",
    icon: "wn",
    accent: "yellow",
    text: "Learn openings by typing moves like e4 and Nf3. Book moves play a two-voice melody.",
    tags: ["White", "Black", "Algebraic notation"],
    stat: `${OPENINGS.length} openings`,
    progress: (p) => summaryLine(summarize(p.levels, chessKeys)),
  },
];

function summaryLine({ stars, maxStars }) {
  return stars ? `★ ${stars}/${maxStars}` : "Not played yet";
}

const Main = () => {
  const progress = useProgress();
  const hasProgress = Object.keys(progress.levels).length > 0 || progress.typing.plays > 0;

  const reset = () => {
    if (window.confirm("Reset all progress? Stars and best scores in this browser will be deleted.")) {
      resetProgress();
    }
  };

  return (
    <>
      <div className="page">
        <Header />

        <section className="hero">
          <div className="hero__text">
            <p className="hero__eyebrow">Keyboard music games</p>
            <h1 className="hero__title">
              Shortcut
              <br />
              <span>Piano</span>
            </h1>
            <p className="hero__lead">An arcade for your keyboard: every correct key plays a note.</p>
            <a href="#games" className="px-btn px-btn--yellow hero__start">
              <span className="blink">▶</span> Press start
            </a>
          </div>
          <div className="hero__art" aria-hidden="true">
            <PixelIcon name="logo" size={260} />
            <div className="hero__notes">
              <PixelIcon name="note" size={56} />
              <PixelIcon name="note" size={40} />
              <PixelIcon name="heart" size={36} />
            </div>
          </div>
        </section>

        <h2 id="games" className="section-title text-shadow">
          Choose a game
        </h2>
        <section className="categories">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.id}
              to={category.to}
              className={`category px-panel category--${category.accent}`}
            >
              <span className="category__number">{String(index + 1).padStart(2, "0")}</span>
              <div className="category__icon">
                <PixelIcon name={category.icon} size={72} />
              </div>
              <h3 className="category__title">{category.title}</h3>
              <p className="category__text">{category.text}</p>
              <div className="category__progress">{category.progress(progress)}</div>
              <ul className="category__tags">
                {category.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className="category__footer">
                <span className="category__stat">{category.stat}</span>
                <span className={`px-btn px-btn--small px-btn--${category.accent}`}>Enter ▶</span>
              </div>
            </Link>
          ))}
        </section>

        <div className="progress-note">
          <span>Progress is saved in this browser only.</span>
          {hasProgress && (
            <button className="px-btn px-btn--ghost px-btn--small" onClick={reset}>
              Reset progress
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Main;
