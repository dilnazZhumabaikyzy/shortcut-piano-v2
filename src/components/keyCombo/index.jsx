// Shortcut keys drawn as pixel keycaps: ["Ctrl", "Enter"] → [Ctrl] + [Enter]
const KeyCombo = ({ keys }) => (
  <span className="px-keys">
    {keys.map((key, index) => (
      <span key={key} className="px-keys">
        {index > 0 && <span className="px-keys__plus">+</span>}
        <kbd className="px-keycap">{key}</kbd>
      </span>
    ))}
  </span>
);

export default KeyCombo;
