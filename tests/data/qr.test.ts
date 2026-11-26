import assert from "node:assert/strict";
import { test } from "node:test";

import { encodeQr, qrSvg } from "@/lib/qr";

/* Matrice de référence produite par la bibliothèque Python `qrcode`
   (version 3, niveau M, masque 2, mode octet) : l'encodeur doit la
   reproduire module pour module. */
const REF = [
  "#######.....#...#.###.#######",
  "#.....#..#.##..##...#.#.....#",
  "#.###.#.#.#...###.#.#.#.###.#",
  "#.###.#.#.#.###.##.#..#.###.#",
  "#.###.#.#.###....###..#.###.#",
  "#.....#.##.#.#.#.#..#.#.....#",
  "#######.#.#.#.#.#.#.#.#######",
  "........#.##....#...#........",
  "#.#####....#####.#....#####..",
  "#.####.#.##.....#############",
  "#...#.#####.##.##...###.#....",
  ".#..#..#......###..###..##.#.",
  "##....#####....#.#.#......#.#",
  "####.#...###.#..#.##..#.#####",
  ".##...#..###.###....#...###..",
  "######..######.....###.##....",
  "..#...#.#.##..######......#..",
  "####...###.#....####..###..##",
  "#.#.###...###..###......#....",
  "#..##....####.#.#.##.#.#.#.#.",
  "#..#####........##.##########",
  "........#.#.###...###...##.##",
  "#######..#.#.###.####.#.###..",
  "#.....#.##.#.#.#....#...##..#",
  "#.###.#.##.##.#.##..#####.#..",
  "#.###.#.###.##..#####....####",
  "#.###.#.####.####.#...######.",
  "#.....#..###..#.#.####...#.#.",
  "#######.#.#.###..###.#..###.."
];

const show = (m: boolean[][]) => m.map((r) => r.map((c) => (c ? "#" : ".")).join(""));

test("Q1 · identique à la référence, module pour module", () => {
  assert.deepEqual(show(encodeQr("hello world https://e-dome.ch/x?ref=abc", 2)), REF);
});

test("Q2 · un lien d'apporteur tient dans un QR compact, avec ses trois repères", () => {
  const m = encodeQr("https://edome-demo.vercel.app/explorer/3f1c2a9e-1b2c-4d5e-8f90-123456789abc?ref=abcd2345&src=qr");
  assert.equal(m.length, 41, "version 6");
  const finder = (x: number, y: number) => m[y][x] && m[y][x + 6] && m[y + 6][x] && !m[y + 1][x + 1] && m[y + 3][x + 3];
  assert.ok(finder(0, 0) && finder(34, 0) && finder(0, 34));
  assert.ok(m[33][8], "module noir fixe");
});

test("Q3 · le SVG est autonome et un texte trop long est refusé", () => {
  const svg = qrSvg("https://e-dome.ch");
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /<path d="M/);
  assert.throws(() => encodeQr("x".repeat(600)));
});
