"use client";

import { useEffect, useRef, type ReactNode } from "react";

const CHARS =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789<>-_/[]{}=+*!?#";

const esc = (c: string) =>
  c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;

/* Decode a wrapped element's text on hover. Triggers off the nearest `.group`
   ancestor (your card), so it fires when the whole card is hovered — falling
   back to the element's own hover if there's no group. Re-runs each hover.
     <DecodeEffectHover><span className="...">status: online</span></DecodeEffectHover>
   Best on plain-text children (nested markup flattens while animating). */
export default function DecodeEffectHover({
  children,
}: {
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
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

    // Hover trigger: the nearest .group (the card), else the element itself.
    const trigger = (wrap.closest(".group") as HTMLElement | null) ?? el;

    let raf = 0;

    const decode = () => {
      cancelAnimationFrame(raf);
      const queue = Array.from(text).map((to) => {
        const start = Math.floor(Math.random() * 12);
        const end = start + 10 + Math.floor(Math.random() * 16);
        return { to, start, end, char: null as string | null };
      });
      let frame = 0;
      const step = () => {
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
        if (done >= queue.length) {
          el.textContent = text;
          return;
        }
        frame++;
        raf = requestAnimationFrame(step);
      };
      step();
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };

    trigger.addEventListener("mouseenter", decode);
    trigger.addEventListener("mouseleave", reset);

    return () => {
      cancelAnimationFrame(raf);
      trigger.removeEventListener("mouseenter", decode);
      trigger.removeEventListener("mouseleave", reset);
      el.textContent = text;
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
