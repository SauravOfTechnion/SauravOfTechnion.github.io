"use client";

import { useEffect, useRef, useState } from "react";

/** Original streamline study: trajectories bend around the visitor's pointer. */
export function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);
  const dirtyRef = useRef(true);
  useEffect(() => { pauseRef.current = paused; dirtyRef.current = true; }, [paused]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const host = canvas.parentElement!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, clock = 0, last = 0;
    let visible = true;
    let px = 0.7, py = 0.4, tx = 0.7, ty = 0.4;
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden || now - last < 33) return;
      if ((reduced.matches || pauseRef.current) && !dirtyRef.current) return;
      dirtyRef.current = false;
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      if (!reduced.matches && !pauseRef.current) { clock += dt; px += (tx - px) * 0.04; py += (ty - py) * 0.04; }
      ctx.clearRect(0, 0, width, height);
      const scale = Math.max(width, height);
      const strands = width < 600 ? 125 : 230;
      for (let i = 0; i < strands; i++) {
        const seed = i * 0.61803398875;
        const offset = (i / strands - 0.5) * 2.1;
        const light = Math.pow((Math.sin(i * 1.734) + 1) / 2, 8);
        ctx.beginPath();
        for (let j = 0; j <= 100; j++) {
          const y = j / 100;
          const wave = Math.sin(y * 6.5 + offset * 3 + clock * 0.09) * 0.12 + Math.sin(y * 12 - offset * 4) * 0.025;
          const focus = Math.exp(-Math.pow((y - py) * 3, 2));
          const x = 0.61 + offset * (0.13 + Math.pow(Math.abs(y - 0.48), 1.4) * 0.8) + wave + (px - 0.5) * focus * 0.1;
          const sx = x * width + Math.sin(seed * 30 + y * 9) * 2;
          const sy = y * height;
          if (j === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.lineWidth = light > 0.7 ? 1.1 : 0.55;
        ctx.strokeStyle = `rgba(${137 + light * 77},${160 + light * 80},${93 + light * 65},${0.045 + light * 0.28})`;
        ctx.stroke();
      }
      for (let i = 0; i < 500; i++) {
        const x = ((Math.sin(i * 127.1) * 43758.5453) % 1 + 1) % 1;
        const y = (((Math.sin(i * 311.7) * 9512.1) % 1 + 1) % 1 + clock * (0.002 + (i % 5) * 0.0004)) % 1;
        ctx.fillStyle = `rgba(202,225,152,${0.08 + (i % 7) * 0.026})`;
        ctx.fillRect(x * width, y * height, scale > 1000 ? 1.2 : 0.8, 0.8);
      }
    };
    const resize = () => {
      width = host.clientWidth; height = host.clientHeight;
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirtyRef.current = true;
    };
    const move = (event: PointerEvent) => { const box = host.getBoundingClientRect(); tx = (event.clientX - box.left) / box.width; ty = (event.clientY - box.top) / box.height; };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); intersection.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    resize(); frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect(); host.removeEventListener("pointermove", move); };
  }, []);
  return <><canvas className="flow-field" ref={canvasRef} aria-hidden="true" /><button className="field-pause" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? "Resume landscape" : "Pause landscape"}<span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button></>;
}
