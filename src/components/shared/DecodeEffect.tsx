"use client";

import { useEffect, useRef, type ReactNode } from "react";

const CHARS =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789<>-_/[]{}=+*!?#";

const esc = (c: string) =>
  c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;

/* Decode a child's text once when it scrolls into view:
     <DecodeEffect><h2 className="section-heading">Tools of the trade.</h2></DecodeEffect>
   Best on plain-text children — nested markup flattens while animating. */
export default function DecodeEffect({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Capture the original text ONCE. Strict Mode runs effects twice; without
  // this, the second run would re-read the already-scrambled DOM and lock in
  // the wrong characters.
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
          out += `<span class="text-accent" aria-hidden="true">${q.char}</span>`;
        } else {
          out += `<span style="opacity:0" aria-hidden="true">${esc(q.to)}</span>`;
        }
      }
      el.innerHTML = out;
      return done >= queue.length;
    };

    const loop = () => {
      if (render()) {
        el.textContent = text;
        el.removeAttribute("aria-label");
        return;
      }
      frame++;
      raf = requestAnimationFrame(loop);
    };

    render(); // hidden initial state so the full text never flashes

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
      el.textContent = text; // restore clean text (guards Strict Mode re-runs)
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
