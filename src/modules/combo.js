// Matching key presses against a note's shortcut.
// A shortcut is a keyCode or an array of keyCodes, e.g. [17, 67] for Ctrl+C.

const MODIFIER_FLAGS = {
  16: "shiftKey",
  17: "ctrlKey",
  18: "altKey",
  91: "metaKey", // left Cmd / Win
  93: "metaKey", // right Cmd
};
const FLAGS = ["shiftKey", "ctrlKey", "altKey", "metaKey"];

export const isModifier = (keyCode) => keyCode in MODIFIER_FLAGS;

// true  — the keydown completes the shortcut with exactly its modifiers held
// false — a wrong key, or the right key with the wrong modifiers
// null  — a modifier on its own: not judged, the player is still building the combo
export function matchShortcut(code, event) {
  if (isModifier(event.keyCode)) return null;

  const codes = Array.isArray(code) ? code : [code];
  const required = new Set(codes.filter(isModifier).map((c) => MODIFIER_FLAGS[c]));
  const [mainKey] = codes.filter((c) => !isModifier(c));

  return event.keyCode === mainKey && FLAGS.every((flag) => Boolean(event[flag]) === required.has(flag));
}
