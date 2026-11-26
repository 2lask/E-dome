/* ── QR code, sans dépendance ────────────────────────────────────────────────
   Encodeur QR (ISO/IEC 18004) réduit à ce dont E-Dome a besoin : mode octet
   (UTF-8), correction d'erreur M (~15 %), versions 1 à 15 (jusqu'à ~400
   caractères, largement assez pour un lien d'apporteur), choix automatique du
   masque. Sert au kit de partage : un apporteur imprime ou montre le QR de SON
   lien, et chaque scan lui est attribué comme un clic.

   Vérifié module pour module contre la bibliothèque de référence Python
   `qrcode` (versions 3 à 13, les huit masques) et décodé par OpenCV ;
   non-régression : `tests/data/qr.test.ts`. */

export type QrMatrix = boolean[][]; // [y][x], true = module noir

/* Tables de la norme pour le niveau M (indice = version). */
const ECC_PER_BLOCK = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24];
const NUM_BLOCKS = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10];
const MAX_VERSION = 15;
const ECL_M_FORMAT = 0; // bits de format du niveau M

function rawDataModules(ver: number): number {
  let r = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const n = Math.floor(ver / 7) + 2;
    r -= (25 * n - 10) * n - 55;
    if (ver >= 7) r -= 36;
  }
  return r;
}
const dataCodewords = (ver: number) => Math.floor(rawDataModules(ver) / 8) - ECC_PER_BLOCK[ver] * NUM_BLOCKS[ver];

/* ── Reed-Solomon sur GF(256), polynôme 0x11D ── */
function gfMul(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}
function rsDivisor(degree: number): number[] {
  const r = new Array<number>(degree).fill(0);
  r[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < r.length; j++) {
      r[j] = gfMul(r[j], root);
      if (j + 1 < r.length) r[j] ^= r[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return r;
}
function rsRemainder(data: number[], divisor: number[]): number[] {
  const r = new Array<number>(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ (r.shift() as number);
    r.push(0);
    divisor.forEach((c, i) => { r[i] ^= gfMul(c, factor); });
  }
  return r;
}

function alignmentPositions(ver: number, size: number): number[] {
  if (ver === 1) return [];
  const n = Math.floor(ver / 7) + 2;
  const step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
  const out = [6];
  for (let i = 0, pos = size - 7; i < n - 1; i++, pos -= step) out.splice(1, 0, pos);
  return out;
}

const bit = (x: number, i: number) => ((x >>> i) & 1) !== 0;

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

/** Encode un texte (UTF-8). `mask` force un masque (tests) ; sinon le meilleur. */
export function encodeQr(text: string, mask?: number): QrMatrix {
  const bytes = Array.from(new TextEncoder().encode(text));

  /* Plus petite version qui contient les données. */
  let ver = 1;
  for (; ver <= MAX_VERSION; ver++) {
    const countBits = ver <= 9 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= dataCodewords(ver) * 8) break;
  }
  if (ver > MAX_VERSION) throw new Error("QR : texte trop long");
  const size = ver * 4 + 17;

  /* ── Flux de bits : mode octet, longueur, données, terminateur, bourrage ── */
  const bits: number[] = [];
  const push = (val: number, len: number) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  push(0b0100, 4);
  push(bytes.length, ver <= 9 ? 8 : 16);
  for (const b of bytes) push(b, 8);
  const cap = dataCodewords(ver) * 8;
  push(0, Math.min(4, cap - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) push(pad, 8);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));

  /* ── Blocs, correction d'erreur, entrelacement ── */
  const nBlocks = NUM_BLOCKS[ver];
  const eccLen = ECC_PER_BLOCK[ver];
  const raw = Math.floor(rawDataModules(ver) / 8);
  const nShort = nBlocks - (raw % nBlocks);
  const shortLen = Math.floor(raw / nBlocks);
  const div = rsDivisor(eccLen);
  const blocks: number[][] = [];
  for (let i = 0, k = 0; i < nBlocks; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < nShort ? 0 : 1));
    k += dat.length;
    const ecc = rsRemainder(dat, div);
    if (i < nShort) dat.push(0);
    blocks.push(dat.concat(ecc));
  }
  const codewords: number[] = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((b, j) => { if (i !== shortLen - eccLen || j >= nShort) codewords.push(b[i]); });
  }

  /* ── Motifs fixes ── */
  const m: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const fn: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const setF = (x: number, y: number, dark: boolean) => { m[y][x] = dark; fn[y][x] = true; };

  for (let i = 0; i < size; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const d = Math.max(Math.abs(dx), Math.abs(dy));
      const x = cx + dx, y = cy + dy;
      if (x >= 0 && x < size && y >= 0 && y < size) setF(x, y, d !== 2 && d !== 4);
    }
  }
  const al = alignmentPositions(ver, size);
  const last = al.length - 1;
  al.forEach((ax, i) => al.forEach((ay, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setF(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }));

  const drawFormat = (msk: number) => {
    const d = (ECL_M_FORMAT << 3) | msk;
    let rem = d;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const f = ((d << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) setF(8, i, bit(f, i));
    setF(8, 7, bit(f, 6));
    setF(8, 8, bit(f, 7));
    setF(7, 8, bit(f, 8));
    for (let i = 9; i < 15; i++) setF(14 - i, 8, bit(f, i));
    for (let i = 0; i < 8; i++) setF(size - 1 - i, 8, bit(f, i));
    for (let i = 8; i < 15; i++) setF(8, size - 15 + i, bit(f, i));
    setF(8, size - 8, true);
  };
  drawFormat(0); // réserve les zones de format

  if (ver >= 7) {
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const v = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3), b = Math.floor(i / 3);
      setF(a, b, bit(v, i));
      setF(b, a, bit(v, i));
    }
  }

  /* ── Placement en zigzag ── */
  let k = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const up = ((right + 1) & 2) === 0;
        const y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && k < codewords.length * 8) {
          m[y][x] = bit(codewords[k >>> 3], 7 - (k & 7));
          k++;
        }
      }
    }
  }

  const applyMask = (msk: number) => {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[msk](x, y)) m[y][x] = !m[y][x];
  };

  let chosen = mask ?? -1;
  if (chosen < 0) {
    let best = Infinity;
    for (let msk = 0; msk < 8; msk++) {
      applyMask(msk);
      drawFormat(msk);
      const p = penalty(m);
      if (p < best) { best = p; chosen = msk; }
      applyMask(msk);
    }
  }
  applyMask(chosen);
  drawFormat(chosen);
  return m;
}

/* Pénalité de la norme (règles 1 à 4), pour départager les masques. */
function penalty(m: QrMatrix): number {
  const n = m.length;
  let p = 0;
  const line = (get: (i: number) => boolean) => {
    let run = 1;
    for (let i = 1; i < n; i++) {
      if (get(i) === get(i - 1)) run++;
      else { if (run >= 5) p += run - 2; run = 1; }
    }
    if (run >= 5) p += run - 2;
    const pat = [true, false, true, true, true, false, true];
    for (let i = 0; i + 7 <= n; i++) {
      if (!pat.every((v, j) => get(i + j) === v)) continue;
      const before = i >= 4 && [1, 2, 3, 4].every((j) => !get(i - j));
      const after = i + 11 <= n && [7, 8, 9, 10].every((j) => !get(i + j));
      if (before || after) p += 40;
    }
  };
  for (let y = 0; y < n; y++) line((i) => m[y][i]);
  for (let x = 0; x < n; x++) line((i) => m[i][x]);
  for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) {
    const c = m[y][x];
    if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
  }
  let dark = 0;
  for (const row of m) for (const c of row) if (c) dark++;
  const total = n * n;
  p += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
  return p;
}

/** Chemin SVG (un carré par module noir), décalé de la zone de silence. */
export function qrPath(m: QrMatrix, quiet = 4): string {
  let d = "";
  m.forEach((row, y) => row.forEach((c, x) => { if (c) d += `M${x + quiet} ${y + quiet}h1v1h-1z`; }));
  return d;
}

/** SVG autonome (téléchargement, impression). */
export function qrSvg(text: string, { quiet = 4, dark = "#12110e", light = "#ffffff", scale = 8 } = {}): string {
  const m = encodeQr(text);
  const s = m.length + quiet * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s * scale}" height="${s * scale}" shape-rendering="crispEdges"><rect width="${s}" height="${s}" fill="${light}"/><path d="${qrPath(m, quiet)}" fill="${dark}"/></svg>`;
}
