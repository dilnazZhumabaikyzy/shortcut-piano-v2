import { Navigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import PlayArea from "../../components/playArea";
import { getApp, getComposition } from "../../modules/compositions";
import { shortcutKey } from "../../modules/progress";

function Play() {
  const { category, app, songId } = useParams();
  const song = getComposition(category, app, songId);
  const backTo = `/compositions/${category}/${app}`;

  if (!song) return <Navigate to={backTo} replace />;

  return (
    <div className="page">
      <Header />
      <PlayArea
        key={song.id}
        song={song}
        platform={getApp(app).platform}
        backTo={backTo}
        progressKey={shortcutKey(category, app, song.id)}
      />
    </div>
  );
}

export default Play;
