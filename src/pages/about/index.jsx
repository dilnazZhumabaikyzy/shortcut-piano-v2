import { Link } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import PixelIcon from "../../components/pixelIcon";
import { AUTHOR } from "../../modules/about";
import { useProgress } from "../../modules/progress";
import "./index.css";

const MODES = [
  {
    to: "/shortcuts",
    icon: "command",
    title: "Shortcuts",
    text: "Gmail, Windows, macOS and IntelliJ shortcuts turned into songs.",
  },
  {
    to: "/typing",
    icon: "keys",
    title: "Fast typing",
    text: "Type a text and every correct letter plays the next note.",
  },
  { to: "/chess", icon: "wn", title: "Chess", text: "Learn openings by typing moves in algebraic notation." },
];

const STACK = ["React", "React Router", "Tone.js", "chess.js", "Pixel CSS", "GitHub Pages"];

const About = () => {
  const { levels, typing } = useProgress();
  const stars = Object.values(levels).reduce((sum, level) => sum + level.stars, 0);
  const cleared = Object.keys(levels).length;

  return (
    <>
      <div className="page">
        <Header />

        <section className="player px-panel">
          <div className="player__avatar">
            <PixelIcon name="avatar" size={144} />
          </div>
          <div className="player__info">
            <p className="player__eyebrow">Player 1 · Developer</p>
            <h1 className="player__name text-shadow">{AUTHOR.name}</h1>
            <p className="player__bio">
              Hi! I'm Dilnaz, and I made Shortcut Piano: a small arcade where your keyboard becomes an
              instrument. Learning shortcuts, typing and chess openings is more fun when every correct key
              plays a note.
            </p>
            <div className="player__links">
              <a href={`mailto:${AUTHOR.email}`} className="px-btn px-btn--small px-btn--cyan">
                <PixelIcon name="mail" size={20} /> Email me
              </a>
              <a href={AUTHOR.github} target="_blank" rel="noreferrer" className="px-btn px-btn--small">
                GitHub
              </a>
              <a
                href={AUTHOR.repo}
                target="_blank"
                rel="noreferrer"
                className="px-btn px-btn--small px-btn--ghost"
              >
                Source code
              </a>
            </div>
          </div>
        </section>

        <section className="about-grid">
          <div className="about-card px-panel">
            <h2 className="about-card__title">About the game</h2>
            <ul className="about-modes">
              {MODES.map((mode) => (
                <li key={mode.to}>
                  <Link to={mode.to} className="about-mode">
                    <PixelIcon name={mode.icon} size={40} />
                    <span>
                      <strong>{mode.title}</strong>
                      {mode.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-card px-panel">
            <h2 className="about-card__title">Your save file</h2>
            <dl className="about-stats">
              <div>
                <dt>Levels cleared</dt>
                <dd className="hud__value--green">{cleared}</dd>
              </div>
              <div>
                <dt>Stars</dt>
                <dd className="hud__value--yellow about-stats__stars">
                  <PixelIcon name="star" size={18} /> {stars}
                </dd>
              </div>
              <div>
                <dt>Best typing</dt>
                <dd className="hud__value--pink">{typing.best ? `${typing.best.wpm} wpm` : "—"}</dd>
              </div>
            </dl>
            <p className="about-note">
              No accounts, no servers: progress lives only in this browser's local storage.
            </p>

            <h2 className="about-card__title">Built with</h2>
            <ul className="about-stack">
              {STACK.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
