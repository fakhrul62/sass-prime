"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
};

const themeColors: Record<string, string> = {
  dark: "216, 255, 87",
  deep: "255, 103, 77",
  light: "255, 103, 77",
  blue: "7, 17, 25",
  acid: "7, 17, 25",
  coral: "7, 17, 25",
};

export default function SignalCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const canvas = canvasRef.current;
    const labelElement = labelRef.current;
    if (!canvas || !labelElement) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const particles: Particle[] = [];
    const pointer = { x: -100, y: -100, lastX: -100, lastY: -100, speed: 0 };
    const labelPosition = { x: -100, y: -100, targetX: -100, targetY: -100 };
    let frame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let color = themeColors.dark;
    let lastMove = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updateTheme = () => {
      const activeTheme = document.querySelector(".site-header")?.getAttribute("data-active-theme") || "dark";
      color = themeColors[activeTheme] || themeColors.dark;
    };

    const spawnWake = (x: number, y: number, dx: number, dy: number) => {
      const distance = Math.hypot(dx, dy);
      const count = Math.min(12, Math.max(2, Math.ceil(distance / 7)));

      for (let index = 0; index < count; index += 1) {
        const progress = count === 1 ? 1 : index / (count - 1);
        const jitter = (Math.random() - 0.5) * Math.min(12, distance * 0.25);
        particles.push({
          x: x - dx * (1 - progress) + jitter,
          y: y - dy * (1 - progress) + jitter,
          vx: dx * 0.018 + (Math.random() - 0.5) * 0.7,
          vy: dy * 0.018 + (Math.random() - 0.5) * 0.7,
          life: 1,
          size: 2 + Math.random() * Math.min(8, 2 + distance * 0.08),
        });
      }

      if (particles.length > 260) particles.splice(0, particles.length - 260);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const dx = pointer.lastX < 0 ? 0 : event.clientX - pointer.lastX;
      const dy = pointer.lastY < 0 ? 0 : event.clientY - pointer.lastY;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.speed = Math.min(42, Math.hypot(dx, dy));
      labelPosition.targetX = event.clientX;
      labelPosition.targetY = event.clientY;
      if (pointer.lastX >= 0) spawnWake(event.clientX, event.clientY, dx, dy);
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      lastMove = performance.now();
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor-label]");
      if (!target) return;
      setLabel(target.dataset.cursorLabel || "");
      labelElement.classList.add("is-visible");
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor-label]");
      const related = (event.relatedTarget as HTMLElement | null)?.closest?.("[data-cursor-label]");
      if (target && target !== related) labelElement.classList.remove("is-visible");
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.965;
        particle.vy *= 0.965;
        particle.life *= 0.947;
        particle.size *= 0.992;

        if (particle.life < 0.025) {
          particles.splice(index, 1);
          continue;
        }

        context.fillStyle = `rgba(${color}, ${particle.life * 0.46})`;
        const size = Math.max(1, particle.size * particle.life);
        context.fillRect(
          Math.round(particle.x / 4) * 4 - size / 2,
          Math.round(particle.y / 4) * 4 - size / 2,
          size,
          size,
        );
      }

      if (time - lastMove < 1500 && pointer.x >= 0) {
        context.strokeStyle = `rgba(${color}, 0.58)`;
        context.lineWidth = 1;
        const radius = 6 + pointer.speed * 0.18;
        context.beginPath();
        context.moveTo(pointer.x - radius, pointer.y);
        context.lineTo(pointer.x + radius, pointer.y);
        context.moveTo(pointer.x, pointer.y - radius);
        context.lineTo(pointer.x, pointer.y + radius);
        context.stroke();
      }

      labelPosition.x += (labelPosition.targetX - labelPosition.x) * 0.18;
      labelPosition.y += (labelPosition.targetY - labelPosition.y) * 0.18;
      const labelRect = labelElement.getBoundingClientRect();
      const offsetX = labelPosition.x + labelRect.width + 18 > width ? -labelRect.width - 12 : 14;
      const offsetY = labelPosition.y + labelRect.height + 18 > height ? -labelRect.height - 12 : 14;
      labelElement.style.transform = `translate3d(${labelPosition.x + offsetX}px, ${labelPosition.y + offsetY}px, 0)`;

      frame = window.requestAnimationFrame(draw);
    };

    const header = document.querySelector(".site-header");
    const themeObserver = header ? new MutationObserver(updateTheme) : null;
    themeObserver?.observe(header as Node, { attributes: true, attributeFilter: ["data-active-theme"] });

    resize();
    updateTheme();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      themeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="signal-cursor-canvas" aria-hidden="true" />
      <div ref={labelRef} className="signal-cursor-label" aria-hidden="true">
        <span>[ {label} ]</span>
      </div>
    </>
  );
}
