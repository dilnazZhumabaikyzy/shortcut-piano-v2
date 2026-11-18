import { Link } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import PixelIcon from "../../components/pixelIcon";
import { getCompositions } from "../../modules/compositions";
import { shortcutKey, summarize, useProgress } from "../../modules/progress";
import "./index.css";

const APPS = [
  { id: "gmail", title: "Gmail", icon: "mail", text: "Navigate, reply and format mail without the mouse." },
  { id: "windows", title: "Windows", icon: "window", text: "Copy, paste, undo, Explorer and word jumps." },
  { id: "mac", title: "macOS", icon: "command", text: "The Cmd essentials, Finder and Option word jumps." },
  {
    id: "intellij",
    title: "IntelliJ IDEA",
    icon: "bulb",
    text: "Editing, navigation and refactoring (Windows/Linux keymap).",
  },
];

// Every app in the Shortcuts section with its songs and progress keys.
export const SHORTCUT_APPS = APPS.map((app) => {
  const songs = getCompositions("basic", app.id);
  return {
    ...app,
    songs,
    shortcutCount: songs.reduce((sum, song) => sum + song.commands.length, 0),
    progressKeys: songs.map((song) => shortcutKey("basic", app.id, song.id)),
  };
});

const Shortcuts = () => {
  const { levels } = useProgress();

  return (
    <>
      <div className="page">
        <Header />
        <div className="section-head">
          <p className="section-head__eyebrow">Category</p>
          <h1 className="section-head__title text-shadow">Shortcuts</h1>
          <p className="section-head__lead">
            Every shortcut is a note. Press them in the right order and the song plays itself.
          </p>
        </div>

        <section className="modes">
          {SHORTCUT_APPS.map((app) => {
            const progress = summarize(levels, app.progressKeys);
            return (
              <article key={app.id} className="mode px-panel">
                <div className="mode__head">
                  <PixelIcon name={app.icon} size={64} />
                  <h3>{app.title}</h3>
                </div>
                <div className="mode__levels">
                  <div className="mode__level">
                    <div>
                      <div className="mode__level-title">
                        {app.shortcutCount} shortcuts · {app.songs.length} songs
                      </div>
                      <p>{app.text}</p>
                    </div>
                    <Link to={`/compositions/basic/${app.id}`} className="px-btn px-btn--small px-btn--cyan">
                      Play
                    </Link>
                  </div>
                </div>
                <div className="mode__progress">
                  <span>
                    {progress.completed}/{app.songs.length} songs done
                  </span>
                  <span className="mode__stars">
                    <PixelIcon name="star" size={16} /> {progress.stars}/{progress.maxStars}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Shortcuts;
