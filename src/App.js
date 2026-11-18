import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles/base.css";
import About from "./pages/about";
import { ChessMenu, ChessPlay } from "./pages/chess";
import Compositions from "./pages/compositions";
import Instruction from "./pages/instruction";
import Main from "./pages/main-page";
import Play from "./pages/play";
import Shortcuts from "./pages/shortcuts";
import Typing from "./pages/typing";

function App() {
  return (
    // PUBLIC_URL is the sub-path on GitHub Pages ("/shortcut-piano-v2"), empty in development.
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/shortcuts" element={<Shortcuts />} />
        <Route path="/compositions/:category/:app" element={<Compositions />} />
        <Route path="/instruction/:category/:app/:songId" element={<Instruction />} />
        <Route path="/play/:category/:app/:songId" element={<Play />} />
        <Route path="/typing" element={<Typing />} />
        <Route path="/chess" element={<ChessMenu />} />
        <Route path="/chess/:openingId" element={<ChessPlay />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
