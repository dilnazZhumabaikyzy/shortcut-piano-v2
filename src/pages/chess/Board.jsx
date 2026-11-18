import PixelIcon from "../../components/pixelIcon";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

// 8×8 pixel board. `board` is chess.js board(): rows from rank 8 to rank 1.
// orientation "b" shows the board from Black's side.
const Board = ({ board, orientation = "w", lastMove }) => {
  const rows = orientation === "w" ? board : [...board].reverse().map((row) => [...row].reverse());
  const files = orientation === "w" ? FILES : [...FILES].reverse();
  const ranks = orientation === "w" ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="board px-panel" role="img" aria-label="Chess board">
      <div className="board__grid">
        {rows.map((row, r) =>
          row.map((piece, f) => {
            const square = files[f] + ranks[r];
            const dark = (r + f) % 2 === 1;
            const highlighted = lastMove && (lastMove.from === square || lastMove.to === square);
            return (
              <div
                key={square}
                className={`board__square ${dark ? "is-dark" : ""} ${highlighted ? "is-last" : ""}`}
              >
                {f === 0 && <span className="board__rank">{ranks[r]}</span>}
                {r === 7 && <span className="board__file">{files[f]}</span>}
                {piece && <PixelIcon name={piece.color + piece.type} size={48} className="board__piece" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
