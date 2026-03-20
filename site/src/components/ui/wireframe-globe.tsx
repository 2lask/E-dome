"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface GlobeProps {
  size?: number;
  className?: string;
}

export function WireframeGlobe({ size = 420, className = "" }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

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
    const cx = size / 2;
    const cy = size / 2;

    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([cx, cy])
      .clipAngle(90);

    const pathGen = d3.geoPath().projection(projection).context(ctx);

    const pointInPoly = (pt: [number, number], poly: number[][]): boolean => {
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i], [xj, yj] = poly[j];
        if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };

    const pointInFeature = (pt: [number, number], feat: any): boolean => {
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

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const sc = projection.scale() / radius;

      // Globe circle
      ctx.beginPath();
      ctx.arc(cx, cy, projection.scale(), 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(196,149,106,0.25)";
      ctx.lineWidth = 1.5 * sc;
      ctx.stroke();

      // Inner glow
      const glow = ctx.createRadialGradient(cx, cy, projection.scale() * 0.5, cx, cy, projection.scale());
      glow.addColorStop(0, "rgba(196,149,106,0.06)");
      glow.addColorStop(1, "rgba(196,149,106,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, projection.scale(), 0, Math.PI * 2);
      ctx.fill();

      if (!land) return;

      // Graticule
      const grat = d3.geoGraticule();
      ctx.beginPath();
      pathGen(grat());
      ctx.strokeStyle = "rgba(196,149,106,0.12)";
      ctx.lineWidth = 0.5 * sc;
      ctx.stroke();

      // Land outlines
      ctx.beginPath();
      land.features.forEach((f: any) => pathGen(f));
      ctx.strokeStyle = "rgba(196,149,106,0.5)";
      ctx.lineWidth = 1 * sc;
      ctx.stroke();

      // Halftone dots on land
      dots.forEach((d) => {
        const p = projection([d.lng, d.lat]);
        if (p && p[0] >= 0 && p[0] <= size && p[1] >= 0 && p[1] <= size) {
          ctx.beginPath();
          ctx.arc(p[0], p[1], 1.2 * sc, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(196,149,106,0.4)";
          ctx.fill();
        }
      });
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
          const step = 16 * 0.08;
          for (let lng = minLng; lng <= maxLng; lng += step) {
            for (let lat = minLat; lat <= maxLat; lat += step) {
              if (pointInFeature([lng, lat], feat)) dots.push({ lng, lat });
            }
          }
        });

        setReady(true);
        render();
      } catch {}
    };

    // Rotation
    const rot = [0, -15];
    let auto = true;

    const tick = () => {
      if (auto) {
        rot[0] += 0.3;
        projection.rotate(rot as [number, number]);
        render();
      }
    };

    const timer = d3.timer(tick);

    // Drag
    const onDown = (e: MouseEvent) => {
      auto = false;
      const sx = e.clientX, sy = e.clientY;
      const sr = [...rot];
      const onMove = (me: MouseEvent) => {
        rot[0] = sr[0] + (me.clientX - sx) * 0.5;
        rot[1] = Math.max(-90, Math.min(90, sr[1] - (me.clientY - sy) * 0.5));
        projection.rotate(rot as [number, number]);
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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const f = e.deltaY > 0 ? 0.95 : 1.05;
      projection.scale(Math.max(radius * 0.5, Math.min(radius * 2.5, projection.scale() * f)));
      render();
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    load();

    return () => {
      timer.stop();
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [size]);

  return (
    <canvas ref={canvasRef} className={`cursor-grab active:cursor-grabbing ${className}`}
      style={{ width: size, height: size }} />
  );
}
