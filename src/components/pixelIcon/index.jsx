// Pixel-art icons drawn from character grids. Each character maps to a color
// in the icon's palette; "." is transparent. Colors are CSS variables from
// styles/base.css, so icons follow the theme.

const lessThan = ["....", "...C", "..C.", ".C..", "C...", ".C..", "..C.", "...C", "...."];
const slash = ["...B", "...B", "..B.", "..B.", ".B..", ".B..", "B...", "B...", "...."];
const greaterThan = ["....", "C...", ".C..", "..C.", "...C", "..C.", ".C..", "C...", "...."];

const STAR = [
  "....Y....",
  "...YYY...",
  "...YYY...",
  "YYYYYYYYY",
  ".YYYYYYY.",
  "..YYYYY..",
  "..YYYYY..",
  ".YYY.YYY.",
  ".YY...YY.",
];

// Chess pieces, 12×12. O outline, F fill, E detail. Built in white and black
// versions below as "wp", "bk", … (color + piece letter, as in chess.js).
const PIECES = {
  p: [
    "............",
    "....OOOO....",
    "...OFFFFO...",
    "...OFFFFO...",
    "....OFFO....",
    "...OFFFFO...",
    "....OFFO....",
    "....OFFO....",
    "...OFFFFO...",
    "..OFFFFFFO..",
    "..OOOOOOOO..",
    "............",
  ],
  n: [
    "............",
    "....OO......",
    "...OFFOO....",
    "..OFFFFFO...",
    ".OFFEFFFFO..",
    ".OFFFFFFFO..",
    "..OOOFFFFO..",
    "....OFFFFO..",
    "...OFFFFFO..",
    "..OFFFFFFFO.",
    "..OOOOOOOOO.",
    "............",
  ],
  b: [
    "............",
    ".....OO.....",
    "....OFFO....",
    "...OFFEFO...",
    "...OFEFFO...",
    "...OFFFFO...",
    "....OFFO....",
    "....OFFO....",
    "...OFFFFO...",
    "..OFFFFFFO..",
    "..OOOOOOOO..",
    "............",
  ],
  r: [
    "............",
    ".OOO.OO.OOO.",
    ".OFOOFFOOFO.",
    ".OFFFFFFFFO.",
    "..OFFFFFFO..",
    "...OFFFFO...",
    "...OFFFFO...",
    "...OFFFFO...",
    "..OFFFFFFO..",
    ".OFFFFFFFFO.",
    ".OOOOOOOOOO.",
    "............",
  ],
  q: [
    ".O...OO...O.",
    ".OO.OFFO.OO.",
    ".OFOFFFFOFO.",
    ".OFFFFFFFFO.",
    "..OFFFFFFO..",
    "...OFFFFO...",
    "...OFFFFO...",
    "..OOFFFFOO..",
    "..OFFFFFFO..",
    ".OFFFFFFFFO.",
    ".OOOOOOOOOO.",
    "............",
  ],
  k: [
    ".....OO.....",
    "....OOOO....",
    ".....OO.....",
    "..OOOFFOOO..",
    ".OFFFFFFFFO.",
    ".OFFFFFFFFO.",
    "..OFFFFFFO..",
    "...OFFFFO...",
    "..OOFFFFOO..",
    ".OFFFFFFFFO.",
    ".OOOOOOOOOO.",
    "............",
  ],
};

const PIECE_COLORS = {
  w: { O: "var(--line)", F: "var(--ink)", E: "var(--line)" },
  b: { O: "var(--line)", F: "var(--bg-2)", E: "var(--muted)" },
};

const PIECE_ICONS = Object.fromEntries(
  Object.entries(PIECES).flatMap(([type, rows]) =>
    Object.entries(PIECE_COLORS).map(([color, colors]) => [color + type, { rows, colors }])
  )
);

const ICONS = {
  ...PIECE_ICONS,
  logo: {
    rows: [
      "KKKKKKKKKKKKK",
      "KWWBBBWBBBWWK",
      "KWWBBBWBBBWWK",
      "KWWBBBWBBBWWK",
      "KWWWKWWWKWWWK",
      "KWWWKWWWKWWWK",
      "KKKKKKKKKKKKK",
    ],
    colors: { K: "var(--pink)", W: "var(--ink)", B: "var(--bg)" },
  },
  note: {
    rows: [
      "...#######",
      "...#######",
      "...#.....#",
      "...#.....#",
      "...#.....#",
      ".###...###",
      "####..####",
      "####..####",
      ".##....##.",
    ],
    colors: { "#": "var(--cyan)" },
  },
  lock: {
    rows: ["..WWWW..", ".W....W.", ".W....W.", "YYYYYYYY", "YYYKKYYY", "YYYKKYYY", "YYYYYYYY", "YYYYYYYY"],
    colors: { W: "var(--muted)", Y: "var(--muted-2)", K: "var(--bg)" },
  },
  star: { rows: STAR, colors: { Y: "var(--yellow)" } },
  starEmpty: { rows: STAR, colors: { Y: "var(--panel-3)" } },
  mail: {
    rows: [
      "RWWWWWWWWWWR",
      "RRWWWWWWWWRR",
      "RWRWWWWWWRWR",
      "RWWRWWWWRWWR",
      "RWWWRWWRWWWR",
      "RWWWWRRWWWWR",
      "RWWWWWWWWWWR",
      "RWWWWWWWWWWR",
    ],
    colors: { R: "var(--red)", W: "var(--ink)" },
  },
  code: {
    rows: lessThan.map((row, i) => `${row}.${slash[i]}.${greaterThan[i]}`),
    colors: { C: "var(--cyan)", B: "var(--pink)" },
  },
  keys: {
    rows: ["WWWW.WWWW.WWWW", "WKKW.WKKW.WKKW", "WKKW.WKKW.WKKW", "WWWW.WWWW.WWWW", "DDDD.DDDD.DDDD"],
    colors: { W: "var(--ink)", K: "var(--pink)", D: "var(--muted-2)" },
  },
  trophy: {
    rows: [
      ".YYYYYYYYYY.",
      "YYYWYYYYYYYY",
      "Y.YWYYYYYY.Y",
      "Y.YYYYYYYY.Y",
      ".YYYYYYYYYY.",
      "..YYYYYYYY..",
      "...YYYYYY...",
      ".....YY.....",
      ".....YY.....",
      "...OOOOOO...",
      "..OOOOOOOO..",
    ],
    colors: { Y: "var(--yellow)", W: "var(--ink)", O: "var(--orange)" },
  },
  window: {
    rows: [
      "BBBBBBBBBBBB",
      "BPPPPPPPYPRB",
      "BBBBBBBBBBBB",
      "BDDDDDDDDDDB",
      "BDWWWWDDDDDB",
      "BDDDDDDDDDDB",
      "BDWWWWWWWDDB",
      "BDDDDDDDDDDB",
      "BDWWWWWDDDDB",
      "BBBBBBBBBBBB",
    ],
    colors: {
      B: "var(--cyan)",
      P: "var(--pink)",
      Y: "var(--yellow)",
      R: "var(--red)",
      W: "var(--ink)",
      D: "var(--bg)",
    },
  },
  command: {
    rows: [
      ".CC.....CC.",
      "C..C...C..C",
      "C..C...C..C",
      ".CCCCCCCCC.",
      "...C...C...",
      "...C...C...",
      "...C...C...",
      ".CCCCCCCCC.",
      "C..C...C..C",
      "C..C...C..C",
      ".CC.....CC.",
    ],
    colors: { C: "var(--ink)" },
  },
  bulb: {
    rows: [
      "..YYYYY..",
      ".YYWYYYY.",
      "YYWYYYYYY",
      "YYYYYYYYY",
      "YYYYYYYYY",
      ".YYYYYYY.",
      "..YYYYY..",
      "..GGGGG..",
      "..ggggg..",
      "..GGGGG..",
      "...ggg...",
    ],
    colors: { Y: "var(--yellow)", W: "var(--ink)", G: "var(--muted)", g: "var(--muted-2)" },
  },
  avatar: {
    rows: [
      "...HHHHHH...",
      "..HHHHHHHH..",
      ".HHHSSSSHHH.",
      ".HHSSSSSSHH.",
      ".HSESSSSESH.",
      ".HSSSSSSSSH.",
      ".HSSSMMSSSH.",
      ".HHSSSSSSHH.",
      ".HH.SSSS.HH.",
      "...CCCCCC...",
      "..CCCCCCCC..",
      ".CCCCCCCCCC.",
    ],
    colors: { H: "#3a2140", S: "#f2c29b", E: "var(--line)", M: "var(--pink)", C: "var(--cyan)" },
  },
  heart: {
    rows: [
      ".RR...RR.",
      "RRRR.RRRR",
      "RRRRRRRRR",
      "RRRRRRRRR",
      ".RRRRRRR.",
      "..RRRRR..",
      "...RRR...",
      "....R....",
    ],
    colors: { R: "var(--pink)" },
  },
};

// Merges horizontal runs of the same color into one rect.
function toRects(rows, colors) {
  const rects = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === char) end++;
      if (colors[char]) rects.push({ x, y, width: end - x, fill: colors[char] });
      x = end;
    }
  });
  return rects;
}

const PixelIcon = ({ name, size = 32, className = "", title }) => {
  const { rows, colors } = ICONS[name];
  const width = rows[0].length;
  const height = rows.length;

  return (
    <svg
      className={`pixel-icon ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={(size * height) / width}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {toRects(rows, colors).map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.width} height={1} fill={r.fill} />
      ))}
    </svg>
  );
};

export default PixelIcon;
