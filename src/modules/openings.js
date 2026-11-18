// Chess openings for Chess Piano. `moves` is the main line in SAN, both sides;
// the player plays `side` and the other side's replies are made automatically.

import { MELODIES } from "./melodies";

const line = (s) => s.split(" ");

export const OPENINGS = [
  {
    id: "italian",
    title: "Italian Game",
    side: "w",
    description: "Bishop to c4 aims straight at f7. The Giuoco Piano main line with c3 and d4.",
    moves: line("e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2"),
    melody: MELODIES.odeToJoy,
  },
  {
    id: "ruy-lopez",
    title: "Ruy Lopez",
    side: "w",
    description: "The Spanish Game: pressure on the knight that guards e5. Closed main line.",
    moves: line("e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3"),
    melody: MELODIES.furElise,
  },
  {
    id: "queens-gambit",
    title: "Queen's Gambit Declined",
    side: "w",
    description: "White offers the c-pawn; Black keeps the centre with e6.",
    moves: line("d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3"),
    melody: MELODIES.frereJacques,
  },
  {
    id: "london",
    title: "London System",
    side: "w",
    description: "A solid setup: Bf4, e3, c3 and Nd2, almost whatever Black does.",
    moves: line("d4 d5 Bf4 Nf6 e3 c5 c3 Nc6 Nd2 e6 Ngf3"),
    melody: MELODIES.londonBridge,
  },
  {
    id: "najdorf",
    title: "Sicilian Najdorf",
    side: "b",
    description: "Black fights for d4 with the c-pawn; a6 is the Najdorf move.",
    moves: line("e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5"),
    melody: MELODIES.furElise,
  },
  {
    id: "french",
    title: "French Defence",
    side: "b",
    description: "e6 and d5: a solid pawn chain. Classical line with Bg5.",
    moves: line("e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7"),
    melody: MELODIES.mary,
  },
  {
    id: "caro-kann",
    title: "Caro-Kann Defence",
    side: "b",
    description: "c6 prepares d5; the light-squared bishop gets out early to f5.",
    moves: line("e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6"),
    melody: MELODIES.rowYourBoat,
  },
  {
    id: "kings-indian",
    title: "King's Indian Defence",
    side: "b",
    description: "Black lets White build a big centre, then strikes back with e5.",
    moves: line("d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5"),
    melody: MELODIES.odeToJoy,
  },
];

export const getOpening = (id) => OPENINGS.find((o) => o.id === id);

// Moves the player has to type in an opening.
export const playerMoveCount = (opening) =>
  opening.moves.filter((_, i) => (i % 2 === 0 ? "w" : "b") === opening.side).length;

// "Nxe5+" → "Ne5", "0-0" → "O-O": capture and check marks are optional when typing.
export const normalizeSan = (san) =>
  san
    .replace(/[x+#!?]/g, "")
    .replace(/0/g, "O")
    .replace(/o/g, "O");
