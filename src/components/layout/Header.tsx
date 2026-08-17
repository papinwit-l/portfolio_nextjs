"use client";

import { useEffect, useState } from "react";

/* Nav anchors — section ids live on the page sections */
const LINKS = [
  { href: "#about", label: "about" },
  { href: "#work", label: "work" },
  { href: "#skills", label: "skills" },
  { href: "#contact", label: "contact" },
];

/* Theme id + swatch color (the palette's primary accent) */
const THEMES = [
  { id: "signal-cyan", label: "Signal Cyan", color: "#2DD4BF" },
  { id: "terminal-green", label: "Terminal Green", color: "#4ADE80" },
  { id: "deep-indigo", label: "Deep Indigo", color: "#60A5FA" },
  { id: "violet-dusk", label: "Violet Dusk", color: "#A78BFA" },
  { id: "warm-ember", label: "Warm Ember", color: "#FB923C" },
  { id: "ice-steel", label: "Ice Steel", color: "#7DD3FC" },
];

export default function Header() {
  const [theme, setTheme] = useState<string>("signal-cyan");

  /* Sync pressed state with whatever the no-flash script already applied */
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current) setTheme(current);
  }, []);

  function applyTheme(id: string) {
    document.documentElement.setAttribute("data-theme", id);
    try {
      localStorage.setItem("theme", id);
    } catch {
      /* private mode / storage blocked — theme still applies for the session */
    }
    setTheme(id);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-[62px] max-w-[1080px] items-center justify-between px-7">
        {/* Wordmark */}
        <a href="#top" className="font-mono text-[15px] font-medium">
          <span className="text-muted">&gt;&nbsp;</span>
          <span className="text-accent">papinwit</span>
        </a>

        <div className="flex items-center gap-6">
          {/* Nav links — hidden on small screens */}
          <nav className="hidden items-center gap-6 sm:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-[13px] text-muted transition-colors hover:text-accent"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Theme switcher */}
          <div
            role="group"
            aria-label="Color theme"
            className="flex items-center gap-[7px] border-l border-border pl-[10px]"
          >
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTheme(t.id)}
                aria-pressed={theme === t.id}
                aria-label={t.label}
                title={t.label}
                style={{ backgroundColor: t.color }}
                className={`h-[15px] w-[15px] rounded-full border-[1.5px] transition-transform hover:scale-[1.18] ${
                  theme === t.id ? "border-text" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
