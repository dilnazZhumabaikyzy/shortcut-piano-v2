// Shortcut packs built on public-domain melodies.
// Each command: { description, keys (labels for hints), code (keyCodes to press) }.
//
// Only shortcuts a web page can catch are used. The OS or the browser handles
// Win+…, Alt+Tab, Cmd+Q/W/T/N/Tab/Space, Ctrl+W/T/N, Alt+F4 and similar before
// the page sees them (and some would close the game), so they are left out.

import { MELODIES } from "./melodies";

const SHIFT = 16;
const CTRL = 17;
const ALT = 18;
const CMD = 91;

const KEY = {
  ...Object.fromEntries([..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((c) => [c, c.charCodeAt(0)])),
  Backspace: 8,
  Enter: 13,
  Space: 32,
  Left: 37,
  Up: 38,
  Right: 39,
  Insert: 45,
  Delete: 46,
  Comma: 188,
  Period: 190,
  Slash: 191,
  ...Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`F${i + 1}`, 112 + i])),
};

const cmd = (description, keys, code) => ({ description, keys, code });

export const windowsPack = [
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    melody: MELODIES.mary,
    commands: [
      cmd("Copy", ["Ctrl", "C"], [CTRL, KEY.C]),
      cmd("Paste", ["Ctrl", "V"], [CTRL, KEY.V]),
      cmd("Cut", ["Ctrl", "X"], [CTRL, KEY.X]),
      cmd("Undo", ["Ctrl", "Z"], [CTRL, KEY.Z]),
    ],
  },
  {
    id: "ode",
    title: "Ode to Joy",
    melody: MELODIES.odeToJoy,
    commands: [
      cmd("Redo", ["Ctrl", "Y"], [CTRL, KEY.Y]),
      cmd("Select all", ["Ctrl", "A"], [CTRL, KEY.A]),
      cmd("Save", ["Ctrl", "S"], [CTRL, KEY.S]),
      cmd("Find", ["Ctrl", "F"], [CTRL, KEY.F]),
      cmd("Print", ["Ctrl", "P"], [CTRL, KEY.P]),
      cmd("Open a file", ["Ctrl", "O"], [CTRL, KEY.O]),
    ],
  },
  {
    id: "elise",
    title: "Für Elise",
    melody: MELODIES.furElise,
    commands: [
      cmd("Rename the selected item", ["F2"], KEY.F2),
      cmd("Refresh the window", ["F5"], KEY.F5),
      cmd("Delete without the Recycle Bin", ["Shift", "Del"], [SHIFT, KEY.Delete]),
      cmd("Show properties of the selected item", ["Alt", "Enter"], [ALT, KEY.Enter]),
      cmd("Delete the previous word", ["Ctrl", "Backspace"], [CTRL, KEY.Backspace]),
      cmd("Jump to the next word", ["Ctrl", "→"], [CTRL, KEY.Right]),
      cmd("Jump to the previous word", ["Ctrl", "←"], [CTRL, KEY.Left]),
      cmd("Go up one folder in Explorer", ["Alt", "↑"], [ALT, KEY.Up]),
      cmd("Open the context menu", ["Shift", "F10"], [SHIFT, KEY.F10]),
    ],
  },
];

export const macPack = [
  {
    id: "row",
    title: "Row, Row, Row Your Boat",
    melody: MELODIES.rowYourBoat,
    commands: [
      cmd("Copy", ["Cmd", "C"], [CMD, KEY.C]),
      cmd("Paste", ["Cmd", "V"], [CMD, KEY.V]),
      cmd("Cut", ["Cmd", "X"], [CMD, KEY.X]),
      cmd("Undo", ["Cmd", "Z"], [CMD, KEY.Z]),
      cmd("Redo", ["Cmd", "Shift", "Z"], [CMD, SHIFT, KEY.Z]),
      cmd("Select all", ["Cmd", "A"], [CMD, KEY.A]),
    ],
  },
  {
    id: "london",
    title: "London Bridge",
    melody: MELODIES.londonBridge,
    commands: [
      cmd("Save", ["Cmd", "S"], [CMD, KEY.S]),
      cmd("Find", ["Cmd", "F"], [CMD, KEY.F]),
      cmd("Find the next match", ["Cmd", "G"], [CMD, KEY.G]),
      cmd("Print", ["Cmd", "P"], [CMD, KEY.P]),
      cmd("Open a file", ["Cmd", "O"], [CMD, KEY.O]),
      cmd("Bold", ["Cmd", "B"], [CMD, KEY.B]),
    ],
  },
  {
    id: "jacques",
    title: "Frère Jacques",
    melody: MELODIES.frereJacques,
    commands: [
      cmd("Get info in Finder", ["Cmd", "I"], [CMD, KEY.I]),
      cmd("Duplicate files in Finder", ["Cmd", "D"], [CMD, KEY.D]),
      cmd("Move to Trash", ["Cmd", "Delete"], [CMD, KEY.Backspace]),
      cmd("Show hidden files in Finder", ["Cmd", "Shift", "."], [CMD, SHIFT, KEY.Period]),
      cmd("Open app settings", ["Cmd", ","], [CMD, KEY.Comma]),
      cmd("Jump to the previous word", ["Opt", "←"], [ALT, KEY.Left]),
      cmd("Jump to the next word", ["Opt", "→"], [ALT, KEY.Right]),
    ],
  },
];

// IntelliJ IDEA, default Windows/Linux keymap.
export const intellijPack = [
  {
    id: "london",
    title: "London Bridge",
    melody: MELODIES.londonBridge,
    commands: [
      cmd("Show intention actions and quick-fixes", ["Alt", "Enter"], [ALT, KEY.Enter]),
      cmd("Basic code completion", ["Ctrl", "Space"], [CTRL, KEY.Space]),
      cmd("Duplicate line", ["Ctrl", "D"], [CTRL, KEY.D]),
      cmd("Delete line", ["Ctrl", "Y"], [CTRL, KEY.Y]),
      cmd("Comment line", ["Ctrl", "/"], [CTRL, KEY.Slash]),
      cmd("Reformat code", ["Ctrl", "Alt", "L"], [CTRL, ALT, KEY.L]),
    ],
  },
  {
    id: "jacques",
    title: "Frère Jacques",
    melody: MELODIES.frereJacques,
    commands: [
      cmd("Go to declaration", ["Ctrl", "B"], [CTRL, KEY.B]),
      cmd("Recent files", ["Ctrl", "E"], [CTRL, KEY.E]),
      cmd("Go to line", ["Ctrl", "G"], [CTRL, KEY.G]),
      cmd("File structure", ["Ctrl", "F12"], [CTRL, KEY.F12]),
      cmd("Find usages", ["Alt", "F7"], [ALT, KEY.F7]),
      cmd("Find action", ["Ctrl", "Shift", "A"], [CTRL, SHIFT, KEY.A]),
      cmd("Next highlighted error", ["F2"], KEY.F2),
    ],
  },
  {
    id: "elise",
    title: "Für Elise",
    melody: MELODIES.furElise,
    commands: [
      cmd("Rename", ["Shift", "F6"], [SHIFT, KEY.F6]),
      cmd("Extract variable", ["Ctrl", "Alt", "V"], [CTRL, ALT, KEY.V]),
      cmd("Extract method", ["Ctrl", "Alt", "M"], [CTRL, ALT, KEY.M]),
      cmd("Optimize imports", ["Ctrl", "Alt", "O"], [CTRL, ALT, KEY.O]),
      cmd("Generate code", ["Alt", "Insert"], [ALT, KEY.Insert]),
      cmd("Run", ["Shift", "F10"], [SHIFT, KEY.F10]),
      cmd("Debug", ["Shift", "F9"], [SHIFT, KEY.F9]),
      cmd("Open settings", ["Ctrl", "Alt", "S"], [CTRL, ALT, KEY.S]),
      cmd("Parameter info", ["Ctrl", "P"], [CTRL, KEY.P]),
    ],
  },
];
