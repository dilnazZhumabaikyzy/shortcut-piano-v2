// Player progress, kept only in this browser (localStorage). Nothing is sent anywhere.
//
// Shape:
// {
//   levels: { "<levelKey>": { best, stars, plays } },   // shortcut songs and chess openings
//   typing: { best: { wpm, accuracy }, plays }
// }
// Level keys: "shortcuts/basic/gmail/hb", "chess/italian".

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "shortcut-piano:progress:v1";
const EMPTY = { levels: {}, typing: { best: null, plays: 0 } };

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...EMPTY, ...saved } : EMPTY;
  } catch {
    return EMPTY; // private mode, blocked storage or corrupt data
  }
}

let progress = read();
const listeners = new Set();

function commit(next) {
  progress = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: progress still lives for this session.
  }
  listeners.forEach((listener) => listener());
}

// Another tab saved progress.
window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) return;
  progress = read();
  listeners.forEach((listener) => listener());
});

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useProgress = () => useSyncExternalStore(subscribe, () => progress);

export const shortcutKey = (category, app, songId) => `shortcuts/${category}/${app}/${songId}`;
export const chessKey = (openingId) => `chess/${openingId}`;

// 3 stars: no mistakes and no hint · 2 stars: up to 3 mistakes · 1 star: finished.
export function starsFor({ mistakes, hintUsed }) {
  if (mistakes === 0 && !hintUsed) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

// Saves a finished level; keeps the best score and the most stars.
// Returns { isRecord } — true when the score beats the previous best.
export function recordLevel(key, { score, stars }) {
  const previous = progress.levels[key];
  const isRecord = !previous || score > previous.best;
  commit({
    ...progress,
    levels: {
      ...progress.levels,
      [key]: {
        best: Math.max(score, previous?.best ?? 0),
        stars: Math.max(stars, previous?.stars ?? 0),
        plays: (previous?.plays ?? 0) + 1,
      },
    },
  });
  return { isRecord };
}

// Saves a finished typing text. Best result = highest WPM.
export function recordTyping({ wpm, accuracy }) {
  const previous = progress.typing.best;
  const isRecord = !previous || wpm > previous.wpm;
  commit({
    ...progress,
    typing: {
      best: isRecord ? { wpm, accuracy } : previous,
      plays: progress.typing.plays + 1,
    },
  });
  return { isRecord };
}

export function resetProgress() {
  commit(EMPTY);
}

// Totals for a list of level keys: { completed, stars, maxStars }.
export function summarize(levels, keys) {
  return keys.reduce(
    (sum, key) => ({
      completed: sum.completed + (levels[key] ? 1 : 0),
      stars: sum.stars + (levels[key]?.stars ?? 0),
      maxStars: sum.maxStars + 3,
    }),
    { completed: 0, stars: 0, maxStars: 0 }
  );
}
