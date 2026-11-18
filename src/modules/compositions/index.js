import { intellijPack, macPack, windowsPack } from "../packs";
import { getShortcuts } from "../shortcuts";

// A song is a sequence of notes. Each note is bound to a keyboard shortcut:
//   notes[k].code  — keyCode, or an array of keyCodes for a key combination
//   notes[k].play  — the pitch played by the synth
// notes[k] teaches the shortcut shortcuts[section[0] + k] (see modules/shortcuts).
// noteOrder lists note indexes in the order they are played.

const basicGmail = [
  {
    id: "hb",
    title: "Happy Birthday",
    description: "8 basic commands to learn",
    section: [0, 8],
    notes: [
      { code: 80, play: "G4" }, // P
      { code: 78, play: "A4" }, // N
      { code: 188, play: "C5" }, // ,
      { code: 88, play: "B4" }, // X
      { code: 83, play: "D5" }, // S
      { code: 27, play: "E5" }, // Esc
      { code: 69, play: "F5" }, // E
      { code: 77, play: "A5" }, // M
    ],
    noteOrder: [0, 0, 1, 0, 2, 3, 0, 1, 0, 4, 2, 0, 0, 7, 5, 2, 3, 1, 6, 6, 5, 2, 4, 2],
  },
  {
    id: "jb",
    title: "Jingle Bells",
    description: "10 basic commands to learn",
    section: [8, 18],
    notes: [
      { code: 85, play: "C4" }, // U
      { code: 75, play: "A4" }, // K
      { code: 82, play: "G4" }, // R
      { code: 65, play: "F4" }, // A
      { code: 70, play: "D4" }, // F
      { code: 90, play: "A#4" }, // Z
      { code: 189, play: "E4" }, // -
      { code: 66, play: "C5" }, // B
      { code: 186, play: "G5" }, // ;
      { code: 74, play: "D5" }, // J
    ],
    noteOrder: [
      0, 1, 2, 3, 0,
      0, 0, 0, 1, 2, 3, 4,
      4, 5, 1, 2, 6,
      7, 7, 5, 2, 1,
      0, 1, 2, 3, 0,
      0, 0, 0, 1, 2, 3, 4,
      4, 5, 1, 2,
      7, 7, 7, 9, 7, 5, 2, 3,
      7, 1, 1, 1, 1, 1, 1, 1, 7,
      3, 2, 1, 5, 5, 5, 5, 1, 1,
      1, 1, 1, 2, 2, 1, 2, 7, 1, 1, 1,
      1, 1, 1, 2, 2, 1, 7, 1, 1, 1,
      1, 1, 1, 1, 7, 3,
    ],
  },
  {
    id: "ttls",
    title: "Twinkle Twinkle Little Star",
    description: "6 basic commands to learn",
    section: [18, 24],
    notes: [
      { code: [16, 49], play: "C#4" }, // Shift + 1
      { code: [16, 51], play: "G#4" }, // Shift + 3
      { code: [16, 27], play: "A#4" }, // Shift + Esc
      { code: [17, 13], play: "F4" }, // Ctrl + Enter
      { code: [17, 190], play: "F#4" }, // Ctrl + .
      { code: [17, 188], play: "D#4" }, // Ctrl + ,
    ],
    noteOrder: [
      0, 0, 1, 1, 2, 2, 1,
      4, 4, 3, 3, 5, 5, 0,
      1, 1, 4, 4, 3, 3, 5,
      1, 1, 4, 4, 3, 3, 5,
      0, 0, 1, 1, 2, 2, 1,
      4, 4, 3, 3, 5, 5, 0,
    ],
  },
];

// Turns a melody and its commands into a song: the i-th distinct pitch of the
// melody (in order of first appearance) is played by the i-th command.
function buildSong({ id, title, melody, commands }) {
  const pitches = [...new Set(melody)];
  if (pitches.length !== commands.length) {
    throw new Error(`${title}: ${pitches.length} pitches but ${commands.length} commands`);
  }
  return {
    id,
    title,
    description: `${commands.length} shortcuts to learn`,
    commands,
    notes: commands.map((command, i) => ({ code: command.code, play: pitches[i] })),
    noteOrder: melody.map((pitch) => pitches.indexOf(pitch)),
  };
}

const gmailShortcuts = getShortcuts("gmail");
const withCommands = (song) => ({ ...song, commands: gmailShortcuts.slice(...song.section) });

const compositions = {
  basic: {
    gmail: basicGmail.map(withCommands),
    windows: windowsPack.map(buildSong),
    mac: macPack.map(buildSong),
    intellij: intellijPack.map(buildSong),
  },
  advanced: {},
};

// Per-app settings: which on-screen keyboard labels to use.
const APPS = {
  gmail: { title: "Gmail", platform: "win" },
  windows: { title: "Windows", platform: "win" },
  mac: { title: "macOS", platform: "mac" },
  intellij: { title: "IntelliJ IDEA", platform: "win" },
  vscode: { title: "VS Code", platform: "win" },
};

export function getApp(app) {
  return APPS[app] ?? { title: app, platform: "win" };
}

// Returns the song list for a category/app pair, or undefined if none exists yet.
// Every playable song has `commands`: commands[k] is the shortcut for notes[k].
export function getCompositions(category, app) {
  return compositions[category]?.[app];
}

export function getComposition(category, app, songId) {
  return getCompositions(category, app)?.find((song) => song.id === songId);
}
