"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Each step is a typed command + its printed output. */
type Step = { cmd: string; out: ReactNode };

const STEPS: Step[] = [
  {
    cmd: "whoami",
    out: (
      <span className="text-text">
        Papinwit Lertwassana &mdash; Full-Stack Developer
      </span>
    ),
  },
  {
    cmd: "cat contact.json",
    out: (
      <div className="text-text">
        <div>{"{"}</div>
        <div className="pl-4">
          <span className="text-muted">&quot;email&quot;</span>:{" "}
          <a
            href="mailto:pae.papinwit@gmail.com"
            className="text-accent hover:underline"
          >
            &quot;pae.papinwit@gmail.com&quot;
          </a>
          ,
        </div>
        <div className="pl-4">
          <span className="text-muted">&quot;github&quot;</span>:{" "}
          <a
            href="https://github.com/papinwit-l"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            &quot;github.com/papinwit-l&quot;
          </a>
          ,
        </div>
        <div className="pl-4">
          <span className="text-muted">&quot;phone&quot;</span>:{" "}
          <a href="tel:+66629391415" className="text-accent hover:underline">
            &quot;+66 62 939 1415&quot;
          </a>
          ,
        </div>
        <div className="pl-4">
          <span className="text-muted">&quot;location&quot;</span>:{" "}
          <span>&quot;Bangkok, Thailand&quot;</span>
        </div>
        <div>{"}"}</div>
      </div>
    ),
  },
  {
    cmd: "cat status.txt",
    out: (
      <span className="text-muted">
        &gt; Open to full-stack roles &mdash; let&rsquo;s talk.
      </span>
    ),
  },
];

const TYPE_MS = 42; // per character
const AFTER_CMD_MS = 260; // pause after a command finishes typing
const AFTER_OUT_MS = 420; // pause after output before next command

export default function Contact() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<"typing" | "revealed">("typing");

  // Start when scrolled into view; jump straight to done under reduced motion.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(STEPS.length);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Drive the typewriter one transition at a time.
  useEffect(() => {
    if (!started || step >= STEPS.length) return;
    const cur = STEPS[step];
    let t: number;
    if (phase === "typing") {
      if (typed < cur.cmd.length) {
        t = window.setTimeout(() => setTyped((n) => n + 1), TYPE_MS);
      } else {
        t = window.setTimeout(() => setPhase("revealed"), AFTER_CMD_MS);
      }
    } else {
      t = window.setTimeout(() => {
        setStep((s) => s + 1);
        setTyped(0);
        setPhase("typing");
      }, AFTER_OUT_MS);
    }
    return () => clearTimeout(t);
  }, [started, step, typed, phase]);

  const done = step >= STEPS.length;

  return (
    <section
      id="contact"
      className="scroll-mt-[62px] border-t border-border py-[90px]"
    >
      <div className="mx-auto max-w-[1080px] px-7">
        <span className="eyebrow">// contact</span>
        <h2 className="section-heading mt-[18px]">
          Let&rsquo;s build something.
        </h2>

        {/* Terminal window */}
        <div
          ref={rootRef}
          className="mt-8 max-w-[600px] overflow-hidden rounded-card border border-border bg-surface"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-muted/40" />
            <span className="h-3 w-3 rounded-full bg-muted/40" />
            <span className="h-3 w-3 rounded-full bg-muted/40" />
            <span className="ml-2 font-mono text-xs text-muted">
              papinwit@portfolio:~
            </span>
          </div>

          {/* Body */}
          <div className="min-h-[240px] p-5 font-mono text-[13px] leading-relaxed sm:p-6">
            {STEPS.map((s, i) => {
              if (i > step) return null;
              const isCurrent = i === step && !done;
              const cmdText = isCurrent ? s.cmd.slice(0, typed) : s.cmd;
              const showOut = i < step || (isCurrent && phase === "revealed");
              const typingHere = isCurrent && phase === "typing";
              return (
                <div key={i} className="mb-3">
                  <div>
                    <span className="text-accent">$</span> {cmdText}
                    {typingHere && (
                      <span className="terminal-cursor" aria-hidden />
                    )}
                  </div>
                  {showOut && <div className="mt-1">{s.out}</div>}
                </div>
              );
            })}

            {done && (
              <div>
                <span className="text-accent">$</span>{" "}
                <span className="terminal-cursor" aria-hidden />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
