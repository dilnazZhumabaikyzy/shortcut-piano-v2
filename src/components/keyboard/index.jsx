import "./index.css";
import { ROWS } from "./layout";

// macOS names for the modifier keys (matched by key id).
const MAC_LABELS = { Win: "Cmd", Alt1: "Opt", Alt2: "Opt" };

const Key = ({ keyDef, pressedKeys, platform, half = false }) => {
  const classes = [
    "kb-key",
    keyDef.quadrants && "kb-key--quad",
    half && "kb-key--half",
    pressedKeys.has(keyDef.id) && "is-pressed",
  ];
  return (
    <div className={classes.filter(Boolean).join(" ")} style={{ "--w": keyDef.w ?? 1 }}>
      {keyDef.quadrants
        ? Object.entries(keyDef.quadrants).map(([quadrant, label]) => (
            <span className={`kb-key__${quadrant}`} key={quadrant}>
              {label}
            </span>
          ))
        : (platform === "mac" && MAC_LABELS[keyDef.id]) || keyDef.name}
    </div>
  );
};

// Static on-screen keyboard; highlights the keys in `pressedKeys` (a Set of key ids).
// platform: "win" | "mac" — only changes modifier labels.
const Keyboard = ({ pressedKeys, platform = "win" }) => (
  <div className="kb" aria-hidden="true">
    {ROWS.map((row, index) => (
      <div className={`kb-row ${row.id === "functions" ? "kb-row--fn" : ""}`} key={index}>
        {row.keys.map((keyDef) =>
          keyDef.arrows ? (
            <div className="kb-stack" key={keyDef.id}>
              {keyDef.arrows.map((arrow) => (
                <Key key={arrow.id} keyDef={arrow} pressedKeys={pressedKeys} platform={platform} half />
              ))}
            </div>
          ) : (
            <Key key={keyDef.id} keyDef={keyDef} pressedKeys={pressedKeys} platform={platform} />
          )
        )}
      </div>
    ))}
  </div>
);

export default Keyboard;
