"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface GlobeProps { size?: number; className?: string; }

const CITIES = [
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
  { lat: 41.01, lng: 28.98, label: "Istanbul" },
  { lat: 52.52, lng: 13.40, label: "Berlin" },
  { lat: 34.05, lng: -118.24, label: "Los Angeles" },
  { lat: 22.32, lng: 114.17, label: "Hong Kong" },
  { lat: 30.04, lng: 31.24, label: "Le Caire" },
  { lat: 6.52, lng: 3.38, label: "Lagos" },
];

const ARCS: [number, number][] = [
  [0,1],[0,2],[0,4],[0,15],[1,2],[1,14],[2,3],[2,15],[3,16],[3,8],[4,5],[4,12],[4,13],[4,14],[4,18],
  [5,6],[5,7],[5,9],[5,17],[6,17],[7,5],[8,11],[9,17],[10,14],[10,12],[11,3],[12,17],[13,19],[14,18],[15,10],[16,3],[18,13],[19,13],
];

export function WireframeGlobe({ size = 420, className = "" }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const radius = size * 0.42;
    const cx = size / 2, cy = size / 2;

    const projection = d3.geoOrthographic().scale(radius).translate([cx, cy]).clipAngle(90);
    const pathGen = d3.geoPath().projection(projection).context(ctx);

    const pointInPoly = (pt: [number, number], poly: number[][]): boolean => {
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i], [xj, yj] = poly[j];
        if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };

    const pointInFeat = (pt: [number, number], feat: any): boolean => {
      const g = feat.geometry;
      if (g.type === "Polygon") {
        if (!pointInPoly(pt, g.coordinates[0])) return false;
        for (let i = 1; i < g.coordinates.length; i++) if (pointInPoly(pt, g.coordinates[i])) return false;
        return true;
      } else if (g.type === "MultiPolygon") {
        for (const poly of g.coordinates) {
          if (pointInPoly(pt, poly[0])) {
            let hole = false;
            for (let i = 1; i < poly.length; i++) if (pointInPoly(pt, poly[i])) { hole = true; break; }
            if (!hole) return true;
          }
        }
      }
      return false;
    };

    interface Dot { lng: number; lat: number; }
    const dots: Dot[] = [];
    let land: any = null;
    let time = 0;

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);

      // Globe circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(196,149,106,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius);
      glow.addColorStop(0, "rgba(196,149,106,0.05)");
      glow.addColorStop(1, "rgba(196,149,106,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      if (!land) return;

      // Graticule
      ctx.beginPath();
      pathGen(d3.geoGraticule()());
      ctx.strokeStyle = "rgba(196,149,106,0.08)";
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // Land outlines
      ctx.beginPath();
      land.features.forEach((f: any) => pathGen(f));
      ctx.strokeStyle = "rgba(196,149,106,0.45)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Halftone dots
      dots.forEach((d) => {
        const p = projection([d.lng, d.lat]);
        if (p && p[0] >= 0 && p[0] <= size && p[1] >= 0 && p[1] <= size) {
          ctx.beginPath();
          ctx.arc(p[0], p[1], 1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(196,149,106,0.35)";
          ctx.fill();
        }
      });

      // Arcs between cities
      ARCS.forEach(([a, b], ai) => {
        const ca = CITIES[a], cb = CITIES[b];
        const pa = projection([ca.lng, ca.lat]);
        const pb = projection([cb.lng, cb.lat]);
        if (!pa || !pb) return;

        // Check if both points are on visible side
        const ra = d3.geoDistance([ca.lng, ca.lat], projection.invert!([cx, cy]) as [number, number]);
        const rb = d3.geoDistance([cb.lng, cb.lat], projection.invert!([cx, cy]) as [number, number]);
        if (ra > Math.PI / 2 && rb > Math.PI / 2) return;

        // Draw arc
        const mx = (pa[0] + pb[0]) / 2;
        const my = (pa[1] + pb[1]) / 2;
        const dist = Math.hypot(pa[0] - pb[0], pa[1] - pb[1]);
        const lift = dist * 0.3;
        const cpx = mx;
        const cpy = my - lift;

        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.quadraticCurveTo(cpx, cpy, pb[0], pb[1]);
        ctx.strokeStyle = "rgba(196,149,106,0.25)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Traveling dot
        const t = ((time * 0.008 + ai * 0.15) % 1);
        const tx = (1 - t) * (1 - t) * pa[0] + 2 * (1 - t) * t * cpx + t * t * pb[0];
        const ty = (1 - t) * (1 - t) * pa[1] + 2 * (1 - t) * t * cpy + t * t * pb[1];
        ctx.beginPath();
        ctx.arc(tx, ty, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,220,170,0.9)";
        ctx.fill();
      });

      // City markers
      CITIES.forEach((c) => {
        const p = projection([c.lng, c.lat]);
        if (!p) return;
        const d = d3.geoDistance([c.lng, c.lat], projection.invert!([cx, cy]) as [number, number]);
        if (d > Math.PI / 2) return;

        // Pulse ring
        const pulse = Math.sin(time * 0.03 + c.lat * 0.1) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3 + pulse * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(196,149,106,${0.15 + pulse * 0.2})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,220,170,1)";
        ctx.fill();

        // Label
        ctx.font = "bold 10px system-ui, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText(c.label, p[0] + 6, p[1] + 3);
      });

      time++;
    };

    // Load data
    const load = async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json");
        if (!res.ok) return;
        land = await res.json();
        land.features.forEach((feat: any) => {
          const bounds = d3.geoBounds(feat);
          const [[minLng, minLat], [maxLng, maxLat]] = bounds;
          const step = 1.3;
          for (let lng = minLng; lng <= maxLng; lng += step) {
            for (let lat = minLat; lat <= maxLat; lat += step) {
              if (pointInFeat([lng, lat], feat)) dots.push({ lng, lat });
            }
          }
        });
        setReady(true);
      } catch {}
    };

    // Rotation
    const rot: [number, number] = [0, -15];
    let auto = true;

    const tick = () => {
      if (auto) { rot[0] += 0.25; projection.rotate(rot); }
      render();
    };

    const timer = d3.timer(tick);

    // Drag only (no zoom)
    const onDown = (e: MouseEvent) => {
      auto = false;
      const sx = e.clientX, sy = e.clientY;
      const sr: [number, number] = [...rot];
      const onMove = (me: MouseEvent) => {
        rot[0] = sr[0] + (me.clientX - sx) * 0.5;
        rot[1] = Math.max(-90, Math.min(90, sr[1] - (me.clientY - sy) * 0.5));
        projection.rotate(rot);
        render();
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        setTimeout(() => { auto = true; }, 10);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    canvas.addEventListener("mousedown", onDown);
    load();

    return () => { timer.stop(); canvas.removeEventListener("mousedown", onDown); };
  }, [size]);

  return <canvas ref={canvasRef} className={`cursor-grab active:cursor-grabbing ${className}`} style={{ width: size, height: size }} />;
}
