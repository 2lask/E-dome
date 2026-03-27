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

// Simplified continent outlines as [lat, lng] coordinate pairs
// These create recognizable land masses when plotted on the globe
const CONTINENTS: [number, number][][] = [
  // Europe
  [[70,20],[65,0],[60,-5],[55,-10],[50,-10],[45,-10],[40,-5],[35,-5],[35,0],[37,5],[38,10],[40,15],[42,20],[45,15],[48,15],[50,20],[52,20],[55,25],[58,30],[60,30],[65,30],[70,30],[70,20]],
  // Africa
  [[35,0],[35,-5],[30,-10],[25,-15],[20,-17],[15,-17],[10,-15],[5,-10],[0,-10],[-5,-12],[-10,-15],[-15,-18],[-20,-20],[-25,-20],[-30,-18],[-35,-20],[-35,-15],[-30,-10],[-25,10],[-20,15],[-15,20],[-10,25],[-5,30],[0,35],[5,40],[10,45],[15,45],[20,40],[25,35],[30,30],[35,30],[35,20],[35,10],[35,0]],
  // Asia
  [[70,30],[70,40],[70,60],[70,80],[70,100],[70,120],[70,140],[70,170],[65,170],[60,160],[55,140],[50,130],[45,135],[40,140],[35,135],[30,130],[25,120],[20,110],[15,108],[10,105],[5,100],[0,100],[5,95],[10,80],[15,75],[20,70],[25,65],[30,60],[35,55],[40,50],[42,45],[45,40],[50,40],[55,35],[60,30],[65,30],[70,30]],
  // North America
  [[70,-60],[70,-100],[70,-140],[65,-165],[60,-165],[55,-165],[55,-160],[50,-130],[48,-125],[45,-125],[40,-120],[35,-120],[30,-115],[25,-110],[20,-105],[18,-100],[15,-90],[15,-85],[20,-90],[25,-80],[30,-82],[35,-75],[40,-72],[45,-65],[48,-60],[50,-55],[55,-55],[60,-45],[65,-45],[70,-60]],
  // South America
  [[10,-75],[5,-77],[0,-80],[-5,-80],[-10,-77],[-15,-75],[-20,-65],[-25,-60],[-30,-55],[-35,-57],[-40,-62],[-45,-65],[-50,-70],[-55,-68],[-55,-65],[-50,-60],[-45,-55],[-40,-50],[-35,-40],[-30,-40],[-25,-35],[-20,-35],[-15,-40],[-10,-40],[-5,-50],[0,-55],[5,-60],[10,-65],[10,-75]],
  // Australia
  [[-15,130],[-20,115],[-25,115],[-30,115],[-35,117],[-35,120],[-35,138],[-38,145],[-35,150],[-30,153],[-25,153],[-20,148],[-15,145],[-12,142],[-12,135],[-15,130]],
];

// Key cities for markers
const MARKERS = [
  { lat: 46.99, lng: 6.93, label: "Neuch\u00e2tel" },
  { lat: 48.86, lng: 2.35, label: "Paris" },
  { lat: 51.51, lng: -0.13, label: "London" },
  { lat: 40.71, lng: -74.01, label: "New York" },
  { lat: 25.20, lng: 55.27, label: "Duba\u00ef" },
  { lat: 1.35, lng: 103.82, label: "Singapore" },
  { lat: 35.68, lng: 139.69, label: "Tokyo" },
  { lat: -33.87, lng: 151.21, label: "Sydney" },
  { lat: -23.55, lng: -46.63, label: "S\u00e3o Paulo" },
  { lat: 13.76, lng: 100.50, label: "Bangkok" },
  { lat: 55.76, lng: 37.62, label: "Moscou" },
  { lat: 19.43, lng: -99.13, label: "Mexico" },
  { lat: 28.61, lng: 77.21, label: "Delhi" },
  { lat: -1.29, lng: 36.82, label: "Nairobi" },
  { lat: 33.87, lng: 35.51, label: "Beyrouth" },
  { lat: 41.01, lng: 28.98, label: "Istanbul" },
  { lat: 52.52, lng: 13.40, label: "Berlin" },
  { lat: 45.46, lng: 9.19, label: "Milan" },
  { lat: 34.05, lng: -118.24, label: "Los Angeles" },
  { lat: 22.32, lng: 114.17, label: "Hong Kong" },
  { lat: -34.60, lng: -58.38, label: "Buenos Aires" },
  { lat: 37.57, lng: 126.98, label: "S\u00e9oul" },
  { lat: 30.04, lng: 31.24, label: "Le Caire" },
  { lat: 6.52, lng: 3.38, label: "Lagos" },
];

const CONNECTIONS: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[4,5],[5,6],[5,7],[4,9],[6,9],[3,8],
  [0,16],[0,17],[1,16],[2,15],[4,10],[4,14],[5,19],[5,12],[6,21],[6,19],
  [7,5],[8,20],[8,11],[3,18],[10,12],[13,4],[13,23],[14,15],[15,10],
  [16,17],[17,0],[18,3],[19,21],[20,8],[22,4],[22,14],[23,13],
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

function proj(x: number, y: number, z: number, cx: number, cy: number, fov: number): [number, number, number] {
  const sc = fov / (fov + z);
  return [x * sc + cx, y * sc + cy, z];
}

export function InteractiveGlobe({
  className,
  size = 400,
  dotColor = "rgba(255, 230, 200, ALPHA)",
  arcColor = "rgba(230, 190, 140, 0.6)",
  markerColor = "rgba(255, 220, 170, 1)",
  autoRotateSpeed = 0.002,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ryRef = useRef(0.4);
  const rxRef = useRef(0.3);
  const dragRef = useRef({ active: false, sx: 0, sy: 0, sry: 0, srx: 0 });
  const animRef = useRef(0);
  const tRef = useRef(0);

  // Generate ocean dots via fibonacci sphere
  const dotsRef = useRef<[number, number, number][]>([]);
  useEffect(() => {
    const dots: [number, number, number][] = [];
    const gr = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < 1800; i++) {
      const th = (2 * Math.PI * i) / gr;
      const ph = Math.acos(1 - (2 * (i + 0.5)) / 1800);
      dots.push([Math.cos(th) * Math.sin(ph), Math.cos(ph), Math.sin(th) * Math.sin(ph)]);
    }
    dotsRef.current = dots;
  }, []);

  // Generate continent dots (denser)
  const landDotsRef = useRef<[number, number, number][]>([]);
  useEffect(() => {
    const pts: [number, number, number][] = [];
    CONTINENTS.forEach(cont => {
      for (let i = 0; i < cont.length - 1; i++) {
        const [lat1, lng1] = cont[i];
        const [lat2, lng2] = cont[i + 1];
        const steps = 15;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const lat = lat1 + (lat2 - lat1) * t;
          const lng = lng1 + (lng2 - lng1) * t;
          // Add point on outline
          const [x, y, z] = latLngToXYZ(lat, lng, 1);
          pts.push([x, y, z]);
          // Add some fill points inside (offset inward slightly)
          if (s % 2 === 0) {
            const [fx, fy, fz] = latLngToXYZ(lat + (Math.random() - 0.5) * 5, lng + (Math.random() - 0.5) * 5, 1);
            pts.push([fx, fy, fz]);
          }
        }
      }
      // Fill interior with scattered dots
      const lats = cont.map(c => c[0]);
      const lngs = cont.map(c => c[1]);
      const minLat = Math.min(...lats), maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
      for (let i = 0; i < 150; i++) {
        const rlat = minLat + Math.random() * (maxLat - minLat);
        const rlng = minLng + Math.random() * (maxLng - minLng);
        const [x, y, z] = latLngToXYZ(rlat, rlng, 1);
        pts.push([x, y, z]);
      }
    });
    landDotsRef.current = pts;
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
    const cx = w / 2, cy = h / 2, radius = Math.min(w, h) * 0.44, fov = 600;
    if (!dragRef.current.active) ryRef.current += autoRotateSpeed;
    tRef.current += 0.015;
    const time = tRef.current;
    const ry = ryRef.current, rx = rxRef.current;

    ctx.clearRect(0, 0, w, h);

    // Globe circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 230, 200, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Ocean dots (faint)
    dotsRef.current.forEach(([ox, oy, oz]) => {
      let [x, y, z] = [ox * radius, oy * radius, oz * radius];
      [x, y, z] = rotX(x, y, z, rx);
      [x, y, z] = rotY(x, y, z, ry);
      if (z > 0) return;
      const [sx, sy] = proj(x, y, z, cx, cy, fov);
      const da = Math.max(0.15, 0.6 * (1 - (z + radius) / (2 * radius)));
      ctx.fillStyle = dotColor.replace("ALPHA", da.toFixed(2));
      ctx.beginPath();
      ctx.arc(sx, sy, 1, 0, Math.PI * 2);
      ctx.fill();
    });

    // Land dots (brighter, larger)
    landDotsRef.current.forEach(([ox, oy, oz]) => {
      let [x, y, z] = [ox * radius, oy * radius, oz * radius];
      [x, y, z] = rotX(x, y, z, rx);
      [x, y, z] = rotY(x, y, z, ry);
      if (z > 0) return;
      const [sx, sy] = proj(x, y, z, cx, cy, fov);
      const da = Math.max(0.5, 1 * (1 - (z + radius) / (2 * radius)));
      ctx.fillStyle = dotColor.replace("ALPHA", da.toFixed(2));
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw continent outlines
    CONTINENTS.forEach(cont => {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < cont.length; i++) {
        let [x, y, z] = latLngToXYZ(cont[i][0], cont[i][1], radius);
        [x, y, z] = rotX(x, y, z, rx);
        [x, y, z] = rotY(x, y, z, ry);
        if (z > radius * 0.1) { started = false; continue; }
        const [sx, sy] = proj(x, y, z, cx, cy, fov);
        if (!started) { ctx.moveTo(sx, sy); started = true; }
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = "rgba(255, 220, 170, 0.7)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Connection arcs
    CONNECTIONS.forEach(([a, b]) => {
      const ma = MARKERS[a], mb = MARKERS[b];
      let [x1, y1, z1] = latLngToXYZ(ma.lat, ma.lng, radius);
      let [x2, y2, z2] = latLngToXYZ(mb.lat, mb.lng, radius);
      [x1, y1, z1] = rotX(x1, y1, z1, rx); [x1, y1, z1] = rotY(x1, y1, z1, ry);
      [x2, y2, z2] = rotX(x2, y2, z2, rx); [x2, y2, z2] = rotY(x2, y2, z2, ry);
      if (z1 > radius * 0.3 && z2 > radius * 0.3) return;
      const [sx1, sy1] = proj(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = proj(x2, y2, z2, cx, cy, fov);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, mz = (z1 + z2) / 2;
      const ml = Math.sqrt(mx * mx + my * my + mz * mz);
      const ah = radius * 1.2;
      const [scx, scy] = proj(mx / ml * ah, my / ml * ah, mz / ml * ah, cx, cy, fov);
      ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = arcColor; ctx.lineWidth = 1.2; ctx.stroke();

      // Traveling dot
      const t = (Math.sin(time * 1.2 + ma.lat * 0.1) + 1) / 2;
      const tx = (1 - t) ** 2 * sx1 + 2 * (1 - t) * t * scx + t ** 2 * sx2;
      const ty = (1 - t) ** 2 * sy1 + 2 * (1 - t) * t * scy + t ** 2 * sy2;
      ctx.beginPath(); ctx.arc(tx, ty, 2, 0, Math.PI * 2);
      ctx.fillStyle = markerColor; ctx.fill();
    });

    // Markers
    MARKERS.forEach(m => {
      let [x, y, z] = latLngToXYZ(m.lat, m.lng, radius);
      [x, y, z] = rotX(x, y, z, rx); [x, y, z] = rotY(x, y, z, ry);
      if (z > radius * 0.1) return;
      const [sx, sy] = proj(x, y, z, cx, cy, fov);
      // Pulse ring
      const pulse = Math.sin(time * 2 + m.lat) * 0.5 + 0.5;
      ctx.beginPath(); ctx.arc(sx, sy, 4 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,220,170,${0.4 + pulse * 0.4})`; ctx.lineWidth = 1.2; ctx.stroke();
      // Core
      ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fillStyle = markerColor; ctx.fill();
      // Label
      if (m.label) {
        ctx.font = "bold 12px system-ui, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(m.label, sx + 8, sy + 3);
      }
    });

    animRef.current = requestAnimationFrame(draw);
  }, [dotColor, arcColor, markerColor, autoRotateSpeed]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

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
    <canvas ref={canvasRef} className={cn("w-full h-full cursor-grab active:cursor-grabbing", className)}
      style={{ width: size, height: size }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
  );
}
