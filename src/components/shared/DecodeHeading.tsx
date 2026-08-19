"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789<>-_/[]{}=+*!?#";

const esc = (c: string) =>
  c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;

type Tag = "h1" | "h2" | "h3";

export default function DecodeHeading({
  text,
  className = "",
  as = "h2",
}: {
  text: string;
  className?: string;
  as?: Tag;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: leave the real (server-rendered) text untouched.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Per-character schedule: when each glyph starts scrambling and locks in.
    const queue = Array.from(text).map((to) => {
      const start = Math.floor(Math.random() * 18);
      const end = start + 14 + Math.floor(Math.random() * 22);
      return { to, start, end, char: null as string | null };
    });

    let frame = 0;
    let raf = 0;

    const render = () => {
      let out = "";
      let done = 0;
      for (const q of queue) {
        if (q.to === " ") {
          out += " ";
          done++;
        } else if (frame >= q.end) {
          out += esc(q.to);
          done++;
        } else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = CHARS[(Math.random() * CHARS.length) | 0];
          }
          out += `<span class="text-accent">${q.char}</span>`;
        } else {
          // Not started yet — reserve width (no layout shift), stay invisible.
          out += `<span style="opacity:0">${esc(q.to)}</span>`;
        }
      }
      el.innerHTML = out;
      return done >= queue.length;
    };

    const loop = () => {
      if (render()) {
        el.textContent = text; // settle to clean text
        return;
      }
      frame++;
      raf = requestAnimationFrame(loop);
    };

    // Paint the initial (hidden) state so the full text doesn't flash, then
    // kick off the decode once the heading scrolls into view.
    render();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <Tag className={className} aria-label={text}>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </Tag>
  );
}
