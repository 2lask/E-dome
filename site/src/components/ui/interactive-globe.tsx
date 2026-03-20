"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";

interface GlobeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  autoRotateSpeed?: number;
}

const MARKERS = [
  { lat: 46.99, lng: 6.93, label: "Neuch\u00e2tel" },
  { lat: 48.86, lng: 2.35, label: "Paris" },
  { lat: 51.51, lng: -0.13, label: "London" },
  { lat: 40.71, lng: -74.01, label: "New York" },
  { lat: 25.2, lng: 55.27, label: "Dubai" },
  { lat: 1.35, lng: 103.82, label: "Singapore" },
  { lat: -33.87, lng: 151.21, label: "Sydney" },
  { lat: 35.68, lng: 139.69, label: "Tokyo" },
  { lat: 55.76, lng: 37.62, label: "Moscow" },
  { lat: -23.55, lng: -46.63, label: "S\u00e3o Paulo" },
];

const CONNECTIONS: { from: [number, number]; to: [number, number] }[] = [
  { from: [46.99, 6.93], to: [48.86, 2.35] },
  { from: [46.99, 6.93], to: [51.51, -0.13] },
  { from: [46.99, 6.93], to: [25.2, 55.27] },
  { from: [48.86, 2.35], to: [40.71, -74.01] },
  { from: [51.51, -0.13], to: [35.68, 139.69] },
  { from: [25.2, 55.27], to: [1.35, 103.82] },
  { from: [1.35, 103.82], to: [-33.87, 151.21] },
  { from: [40.71, -74.01], to: [-23.55, -46.63] },
  { from: [35.68, 139.69], to: [55.76, 37.62] },
];

function latLngToXYZ(lat: number, lng: number, r: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}
function rotY(x: number, y: number, z: number, a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}
function rotX(x: number, y: number, z: number, a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}
function proj(x: number, y: number, z: number, cx: number, cy: number, fov: number): [number, number] {
  const s = fov / (fov + z);
  return [x * s + cx, y * s + cy];
}

export function InteractiveGlobe({
  className,
  size = 400,
  dotColor = "rgba(196, 149, 106, ALPHA)",
  arcColor = "rgba(196, 149, 106, 0.4)",
  markerColor = "rgba(196, 149, 106, 1)",
  autoRotateSpeed = 0.002,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ryRef = useRef(0.4);
  const rxRef = useRef(0.3);
  const dragRef = useRef({ active: false, sx: 0, sy: 0, sry: 0, srx: 0 });
  const animRef = useRef(0);
  const tRef = useRef(0);
  const dotsRef = useRef<[number, number, number][]>([]);

  useEffect(() => {
    const dots: [number, number, number][] = [];
    const gr = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < 1200; i++) {
      const th = (2 * Math.PI * i) / gr;
      const ph = Math.acos(1 - (2 * (i + 0.5)) / 1200);
      dots.push([Math.cos(th) * Math.sin(ph), Math.cos(ph), Math.sin(th) * Math.sin(ph)]);
    }
    dotsRef.current = dots;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    const cx = w / 2, cy = h / 2, radius = Math.min(w, h) * 0.38, fov = 600;
    if (!dragRef.current.active) ryRef.current += autoRotateSpeed;
    tRef.current += 0.015;
    const time = tRef.current;
    ctx.clearRect(0, 0, w, h);

    // Glow
    const g = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.5);
    g.addColorStop(0, "rgba(196, 149, 106, 0.03)");
    g.addColorStop(1, "rgba(196, 149, 106, 0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    // Outline
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(196, 149, 106, 0.08)"; ctx.lineWidth = 1; ctx.stroke();

    const ry = ryRef.current, rx = rxRef.current;

    // Dots
    for (const dot of dotsRef.current) {
      let [x, y, z] = [dot[0] * radius, dot[1] * radius, dot[2] * radius];
      [x, y, z] = rotX(x, y, z, rx);
      [x, y, z] = rotY(x, y, z, ry);
      if (z > 0) continue;
      const [sx, sy] = proj(x, y, z, cx, cy, fov);
      const a = Math.max(0.1, 1 - (z + radius) / (2 * radius));
      ctx.beginPath(); ctx.arc(sx, sy, 1 + a * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = dotColor.replace("ALPHA", a.toFixed(2)); ctx.fill();
    }

    // Arcs
    for (const c of CONNECTIONS) {
      let [x1, y1, z1] = latLngToXYZ(c.from[0], c.from[1], radius);
      let [x2, y2, z2] = latLngToXYZ(c.to[0], c.to[1], radius);
      [x1, y1, z1] = rotX(x1, y1, z1, rx); [x1, y1, z1] = rotY(x1, y1, z1, ry);
      [x2, y2, z2] = rotX(x2, y2, z2, rx); [x2, y2, z2] = rotY(x2, y2, z2, ry);
      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;
      const [sx1, sy1] = proj(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = proj(x2, y2, z2, cx, cy, fov);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, mz = (z1 + z2) / 2;
      const ml = Math.sqrt(mx * mx + my * my + mz * mz);
      const ah = radius * 1.25;
      const [scx, scy] = proj((mx / ml) * ah, (my / ml) * ah, (mz / ml) * ah, cx, cy, fov);
      ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = arcColor; ctx.lineWidth = 1.2; ctx.stroke();
      // Travel dot
      const t = (Math.sin(time * 1.2 + c.from[0] * 0.1) + 1) / 2;
      const tx = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
      const ty = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;
      ctx.beginPath(); ctx.arc(tx, ty, 2, 0, Math.PI * 2); ctx.fillStyle = markerColor; ctx.fill();
    }

    // Markers
    for (const m of MARKERS) {
      let [x, y, z] = latLngToXYZ(m.lat, m.lng, radius);
      [x, y, z] = rotX(x, y, z, rx); [x, y, z] = rotY(x, y, z, ry);
      if (z > radius * 0.1) continue;
      const [sx, sy] = proj(x, y, z, cx, cy, fov);
      const pulse = Math.sin(time * 2 + m.lat) * 0.5 + 0.5;
      ctx.beginPath(); ctx.arc(sx, sy, 4 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = markerColor.replace("1)", `${(0.2 + pulse * 0.15).toFixed(2)})`);
      ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2); ctx.fillStyle = markerColor; ctx.fill();
      if (m.label) { ctx.font = "10px system-ui, sans-serif"; ctx.fillStyle = markerColor.replace("1)", "0.6)"); ctx.fillText(m.label, sx + 8, sy + 3); }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [dotColor, arcColor, markerColor, autoRotateSpeed]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { active: true, sx: e.clientX, sy: e.clientY, sry: ryRef.current, srx: rxRef.current };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    ryRef.current = dragRef.current.sry + (e.clientX - dragRef.current.sx) * 0.005;
    rxRef.current = Math.max(-1, Math.min(1, dragRef.current.srx + (e.clientY - dragRef.current.sy) * 0.005));
  }, []);
  const onPointerUp = useCallback(() => { dragRef.current.active = false; }, []);

  return (
    <canvas ref={canvasRef} className={cn("cursor-grab active:cursor-grabbing", className)}
      style={{ width: size, height: size }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
  );
}
