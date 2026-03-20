"use client";
import { useEffect, useRef } from "react";

export function EntropyBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      return { w, h };
    };

    let { w, h } = resize();
    window.addEventListener("resize", () => { ({ w, h } = resize()); });

    const color = "#C4956A";

    class Particle {
      x: number; y: number; size: number; order: boolean;
      vx: number; vy: number; ox: number; oy: number;
      influence: number; neighbors: Particle[];
      constructor(x: number, y: number, order: boolean) {
        this.x = x; this.y = y; this.ox = x; this.oy = y;
        this.size = 1.5; this.order = order;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.influence = 0; this.neighbors = [];
      }
      update() {
        if (this.order) {
          const dx = this.ox - this.x;
          const dy = this.oy - this.y;
          let cx = 0, cy = 0;
          this.neighbors.forEach(n => {
            if (!n.order) {
              const d = Math.hypot(this.x - n.x, this.y - n.y);
              const s = Math.max(0, 1 - d / 120);
              cx += n.vx * s; cy += n.vy * s;
              this.influence = Math.max(this.influence, s);
            }
          });
          this.x += dx * 0.04 * (1 - this.influence) + cx * this.influence;
          this.y += dy * 0.04 * (1 - this.influence) + cy * this.influence;
          this.influence *= 0.99;
        } else {
          this.vx += (Math.random() - 0.5) * 0.4;
          this.vy += (Math.random() - 0.5) * 0.4;
          this.vx *= 0.96; this.vy *= 0.96;
          this.x += this.vx; this.y += this.vy;
          if (this.x < w / 2 || this.x > w) this.vx *= -1;
          if (this.y < 0 || this.y > h) this.vy *= -1;
          this.x = Math.max(w / 2, Math.min(w, this.x));
          this.y = Math.max(0, Math.min(h, this.y));
        }
      }
      draw(ctx: CanvasRenderingContext2D) {
        const a = this.order ? 0.6 - this.influence * 0.3 : 0.5;
        ctx.fillStyle = color + Math.round(a * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const cols = Math.floor(w / 25);
    const rows = Math.floor(h / 25);
    const sx = w / cols;
    const sy = h / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = sx * i + sx / 2;
        const y = sy * j + sy / 2;
        particles.push(new Particle(x, y, x < w / 2));
      }
    }

    let t = 0;
    let anim: number;

    function updateNeighbors() {
      particles.forEach(p => {
        p.neighbors = particles.filter(o => o !== p && Math.hypot(p.x - o.x, p.y - o.y) < 80);
      });
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (t % 20 === 0) updateNeighbors();

      particles.forEach(p => {
        p.update();
        p.draw(ctx);
        p.neighbors.forEach(n => {
          const d = Math.hypot(p.x - n.x, p.y - n.y);
          if (d < 50) {
            const a = 0.12 * (1 - d / 50);
            ctx.strokeStyle = color + Math.round(a * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        });
      });

      t++;
      anim = requestAnimationFrame(frame);
    }

    frame();
    return () => { cancelAnimationFrame(anim); };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
