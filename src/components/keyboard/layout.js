// On-screen keyboard layout.
// Each key: { id, name, type, code, location?, quadrants? }
//   id        — DOM id and React key (CSS sizes some keys by id, e.g. #Shift1)
//   code      — KeyboardEvent.keyCode the key reacts to
//   location  — KeyboardEvent.location, to tell left/right modifiers apart
//   quadrants — labels drawn in the key corners (q1..q4)
//   w         — width in key units (default 1); every row adds up to 15 units

const CENTER = "default-key center";
const QUADRANT = "default-key quadrant";

const LEFT = 1;
const RIGHT = 2;

const key = (name, code, extra = {}) => ({ id: extra.id ?? name, name, type: CENTER, code, ...extra });
const quad = (name, code, quadrants, extra = {}) =>
  key(name, code, { type: QUADRANT, quadrants, ...extra });

const functionRow = [
  key("Esc", 27),
  ...Array.from({ length: 12 }, (_, i) => key(`F${i + 1}`, 112 + i)),
  key("PrtSc", 44),
  key("Ins", 45),
  key("Del", 46),
].map((k) => ({ ...k, w: 15 / 16 }));

const numberRow = [
  quad("~", 192, { q2: "~", q3: "`", q4: "Ё" }),
  quad("1", 49, { q2: "!", q3: "1" }),
  quad("2", 50, { q1: '"', q2: "@", q3: "2" }),
  quad("3", 51, { q1: "#", q2: "#", q3: "3" }),
  quad("4", 52, { q1: ";", q2: "$", q3: "4" }),
  quad("5", 53, { q2: "%", q3: "5" }),
  quad("6", 54, { q1: ":", q2: "^", q3: "6" }),
  quad("7", 55, { q1: "?", q2: "&", q3: "7" }),
  quad("8", 56, { q2: "*", q3: "8" }),
  quad("9", 57, { q2: "(", q3: "9" }),
  quad("0", 48, { q2: ")", q3: "0" }),
  quad("_", 189, { q2: "_", q3: "-" }),
  quad("+", 187, { q2: "+", q3: "=" }),
  key("Backspace", 8, { w: 2 }),
];

const topRow = [
  key("Tab", 9, { w: 1.5 }),
  quad("Q", 81, { q2: "Q", q4: "Й" }),
  quad("W", 87, { q2: "W", q4: "Ц" }),
  quad("E", 69, { q2: "E", q4: "У" }),
  quad("R", 82, { q2: "R", q4: "К" }),
  quad("T", 84, { q2: "T", q4: "Е" }),
  quad("Y", 89, { q2: "Y", q4: "Н" }),
  quad("U", 85, { q2: "U", q4: "Г" }),
  quad("I", 73, { q2: "I", q4: "Ш" }),
  quad("O", 79, { q2: "O", q4: "Щ" }),
  quad("P", 80, { q2: "P", q4: "З" }),
  quad("{", 219, { q2: "{", q3: "[", q4: "Х" }),
  quad("}", 221, { q2: "}", q3: "]", q4: "Ъ" }),
  quad("|", 220, { q1: "/", q2: "|", q3: "\\", q4: "\\" }, { id: "Enter1", w: 1.5 }),
];

const homeRow = [
  key("CapsLK", 20, { w: 1.75 }),
  quad("A", 65, { q2: "A", q4: "Ф" }),
  quad("S", 83, { q2: "S", q4: "Ы" }),
  quad("D", 68, { q2: "D", q4: "В" }),
  quad("F", 70, { q2: "F", q4: "А" }),
  quad("G", 71, { q2: "G", q4: "П" }),
  quad("H", 72, { q2: "H", q4: "Р" }),
  quad("J", 74, { q2: "J", q4: "О" }),
  quad("K", 75, { q2: "K", q4: "Л" }),
  quad("L", 76, { q2: "L", q4: "Д" }),
  quad(":", 186, { q2: ":", q3: ";", q4: "Ж" }, { id: "signcolon" }),
  quad('"', 222, { q2: '"', q3: "'", q4: "Э" }, { id: "signquote" }),
  key("Enter", 13, { id: "Enter2", w: 2.25 }),
];

const bottomRow = [
  key("Shift", 16, { id: "Shift1", location: LEFT, w: 2.25 }),
  quad("Z", 90, { q2: "Z", q4: "Я" }),
  quad("X", 88, { q2: "X", q4: "Ч" }),
  quad("C", 67, { q2: "C", q4: "С" }),
  quad("V", 86, { q2: "V", q4: "М" }),
  quad("B", 66, { q2: "B", q4: "И" }),
  quad("N", 78, { q2: "N", q4: "Т" }),
  quad("M", 77, { q2: "M", q4: "Ь" }),
  quad("<", 188, { q2: "<", q3: ",", q4: "Б" }),
  quad(">", 190, { q2: ">", q3: ".", q4: "Ю" }),
  quad(",", 191, { q1: ",", q2: "?", q3: "/", q4: "." }),
  key("Shift", 16, { id: "Shift2", location: RIGHT, w: 2.75 }),
];

const spaceRow = [
  key("Ctrl", 17, { id: "Ctrl1", location: LEFT, w: 1.25 }),
  key("Fn", null),
  key("Win", 91),
  key("Alt", 18, { id: "Alt1", location: LEFT, w: 1.25 }),
  key("", 32, { id: "Space", w: 5.5 }),
  key("Alt", 18, { id: "Alt2", location: RIGHT }),
  key("Ctrl", 17, { id: "Ctrl2", location: RIGHT }),
  key("←", 37, { id: "Left" }),
  key("up-down", null, { arrows: [key("↑", 38, { id: "Up" }), key("↓", 40, { id: "Down" })] }),
  key("→", 39, { id: "Right" }),
];

export const ROWS = [
  { id: "functions", keys: functionRow },
  { id: "numbers", keys: numberRow },
  { keys: topRow },
  { keys: homeRow },
  { keys: bottomRow },
  { keys: spaceRow },
];

const ALL_KEYS = ROWS.flatMap((row) => row.keys.flatMap((k) => k.arrows ?? k));

// Finds the on-screen key for a keyboard event.
export function findKey(event) {
  return ALL_KEYS.find(
    (k) => k.code === event.keyCode && (!k.location || k.location === event.location)
  );
}
