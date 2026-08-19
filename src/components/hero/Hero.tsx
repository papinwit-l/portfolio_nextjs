"use client";

import dynamic from "next/dynamic";

/* Load the WebGL field only on the client, in its own chunk.
   ssr:false keeps three.js out of the server render and the initial bundle. */
const NetworkField = dynamic(() => import("./NetworkField"), {
  ssr: false,
  loading: () => <FieldFallback />,
});

/* Shown while the three.js chunk loads (and as the reduced-JS baseline). */
function FieldFallback() {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "radial-gradient(60% 60% at 30% 40%, var(--color-accent-subtle), transparent 70%)",
      }}
    />
  );
}

export default function Hero() {
  return (
    <header
      id="top"
      className="relative flex min-h-[88vh] items-center overflow-hidden"
    >
      {/* WebGL layer */}
      <div className="absolute inset-0 z-0">
        <NetworkField />
      </div>

      {/* Legibility wash — lifts text off the field on busier palettes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--color-bg) 80%, transparent) 0%, color-mix(in srgb, var(--color-bg) 30%, transparent) 42%, transparent 66%)",
        }}
      />

      {/* Content — pointer-events-none so pointer moves reach the canvas;
          interactive children opt back in with pointer-events-auto. */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1080px] px-7 py-16">
        <span className="eyebrow mb-[18px] block">
          // full-stack developer · bangkok, thailand
        </span>

        <h1 className="mb-[22px] max-w-[16ch] font-display font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.125rem,6.2vw,4.25rem)]">
          From MPLS backbones to <span className="text-accent">Next.js</span>{" "}
          frontends.
        </h1>

        <p className="mb-8 max-w-[54ch] text-muted text-[clamp(0.9375rem,1.7vw,1.125rem)]">
          Eight years keeping carrier-grade networks alive taught me how systems
          really run. Now I build and ship full-stack web apps — frontend, API,
          database, and the server it all lives on.
        </p>

        <div className="pointer-events-auto mb-8 flex flex-wrap gap-[14px]">
          <a href="#work" className="btn btn--solid">
            View work
          </a>
          <a
            href="https://github.com/papinwit-l"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            GitHub ↗
          </a>
        </div>

        <span className="inline-flex items-center gap-[9px] font-mono text-xs text-muted">
          <span className="status-dot" /> available for work
        </span>
      </div>
    </header>
  );
}
