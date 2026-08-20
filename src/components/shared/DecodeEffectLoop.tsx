"use client";

import { useEffect, useRef, type ReactNode } from "react";

const CHARS =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789<>-_/[]{}=+*!?#";

const esc = (c: string) =>
  c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;

/* Like DecodeEffect, but loops: decode → hold → re-scramble → decode …
     <DecodingEffectLoop><span className="eyebrow">// online</span></DecodingEffectLoop>
   - holdMs: pause on resolved text before re-scrambling (default 2s)
   - pauses off-screen, static under reduced motion. Best on plain text. */
export default function DecodingEffectLoop({
  children,
  holdMs = 2000,
}: {
  children: ReactNode;
  holdMs?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Capture original text ONCE — Strict Mode double-runs effects, and without
  // this the second run re-reads the scrambled DOM and corrupts the text.
  const textRef = useRef<string | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const el = (wrap.firstElementChild as HTMLElement | null) ?? wrap;
    if (textRef.current === null)
      textRef.current = (el.textContent ?? "").trim();
    const text = textRef.current;
    if (!text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.setAttribute("aria-label", text);

    let raf = 0;
    let timer = 0;
    let alive = true;
    let visible = false;
    let animating = false;

    const buildQueue = () =>
      Array.from(text).map((to) => {
        const start = Math.floor(Math.random() * 18);
        const end = start + 14 + Math.floor(Math.random() * 22);
        return { to, start, end, char: null as string | null };
      });

    const paint = (queue: ReturnType<typeof buildQueue>, frame: number) => {
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
          out += `<span class="text-accent" aria-hidden="true">${q.char}</span>`;
        } else {
          out += `<span style="opacity:0" aria-hidden="true">${esc(q.to)}</span>`;
        }
      }
      el.innerHTML = out;
      return done >= queue.length;
    };

    const cycle = () => {
      animating = true;
      const queue = buildQueue();
      let frame = 0;
      const step = () => {
        if (paint(queue, frame)) {
          el.textContent = text;
          animating = false;
          timer = window.setTimeout(() => {
            if (alive && visible) cycle();
          }, holdMs);
          return;
        }
        frame++;
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    paint(buildQueue(), 0); // hidden initial state

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (!animating) cycle();
        } else {
          cancelAnimationFrame(raf);
          clearTimeout(timer);
          animating = false;
          el.textContent = text;
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      alive = false;
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      el.textContent = text; // restore clean text (guards Strict Mode re-runs)
    };
  }, [holdMs]);

  return (
    <div ref={wrapRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
