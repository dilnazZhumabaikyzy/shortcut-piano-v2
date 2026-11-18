// Texts for the fast typing mode. Plain ASCII only: every character must be
// typeable on a standard US layout.
export const typingTexts = [
  "Practice makes the hands remember what the head forgets. Play every key like a note, keep a steady rhythm, and the words will start to sing.",
  "A good shortcut saves a second. A thousand good shortcuts save an afternoon. Learn them one by one, and soon your inbox will feel like a quiet room.",
  "The quick brown fox jumps over the lazy dog, then sits at the piano and plays a happy tune with all ten fingers.",
  "Music and typing share a secret: speed comes from calm hands. Relax your shoulders, look at the screen, and let the melody carry you forward.",
  "Every song starts with a single note, and every story starts with a single letter. Keep going, one key at a time, until the last word lands.",
];

export function randomTextIndex(exclude) {
  if (typingTexts.length < 2) return 0;
  let index;
  do {
    index = Math.floor(Math.random() * typingTexts.length);
  } while (index === exclude);
  return index;
}
