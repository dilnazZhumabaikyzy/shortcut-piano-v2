// Public-domain melodies as pitch sequences. Each distinct pitch becomes one
// shortcut in a song (see buildSong in modules/compositions).

const line = (...phrases) => phrases.join(" ").trim().split(/\s+/);

export const MELODIES = {
  // 4 pitches
  mary: line("E4 D4 C4 D4 E4 E4 E4 D4 D4 D4 E4 G4 G4", "E4 D4 C4 D4 E4 E4 E4 E4 D4 D4 E4 D4 C4"),
  // 6 pitches
  odeToJoy: line(
    "E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4",
    "E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4",
    "D4 D4 E4 C4 D4 E4 F4 E4 C4 D4 E4 F4 E4 D4 C4 D4 G3",
    "E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4"
  ),
  // 9 pitches
  furElise: line(
    "E5 D#5 E5 D#5 E5 B4 D5 C5 A4 C4 E4 A4 B4 E4 G#4 B4 C5 E4",
    "E5 D#5 E5 D#5 E5 B4 D5 C5 A4 C4 E4 A4 B4 E4 C5 B4 A4"
  ),
  // 6 pitches
  rowYourBoat: line("C4 C4 C4 D4 E4 E4 D4 E4 F4 G4", "C5 C5 C5 G4 G4 G4 E4 E4 E4 C4 C4 C4", "G4 F4 E4 D4 C4"),
  // 6 pitches
  londonBridge: line("G4 A4 G4 F4 E4 F4 G4 D4 E4 F4 E4 F4 G4", "G4 A4 G4 F4 E4 F4 G4 D4 G4 E4 C4"),
  // 7 pitches
  frereJacques: line(
    "C4 D4 E4 C4 C4 D4 E4 C4 E4 F4 G4 E4 F4 G4",
    "G4 A4 G4 F4 E4 C4 G4 A4 G4 F4 E4 C4",
    "C4 G3 C4 C4 G3 C4"
  ),
};
