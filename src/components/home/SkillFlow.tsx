"use client";

import { useEffect, useState } from "react";

/* The stack as a pipeline: data flows from the frontend down to the wire. */
const STAGES = ["Frontend", "Backend", "Database", "Infra", "Network"];

const X0 = 60;
const X1 = 940;
const Y = 22;

export default function SkillFlow() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const xs = STAGES.map((_, i) => X0 + (i * (X1 - X0)) / (STAGES.length - 1));

  return (
    <svg viewBox="0 0 1000 60" className="w-full">
      {/* Base line */}
      <line
        x1={X0}
        y1={Y}
        x2={X1}
        y2={Y}
        className="stroke-accent/25"
        strokeWidth={1}
      />

      {/* Flowing packets (skipped under reduced motion) */}
      {!reduced &&
        [0, 1.1, 2.2].map((begin, i) => (
          <circle key={i} r={3} cy={Y} className="fill-accent">
            <animate
              attributeName="cx"
              values={`${X0};${X1}`}
              dur="3.3s"
              begin={`${begin}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.12;0.88;1"
              dur="3.3s"
              begin={`${begin}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

      {/* Stage nodes + labels */}
      {STAGES.map((stage, i) => (
        <g key={stage}>
          <circle
            cx={xs[i]}
            cy={Y}
            r={4.5}
            strokeWidth={1.5}
            className="fill-surface stroke-accent"
          />
          <text
            x={xs[i]}
            y={48}
            textAnchor="middle"
            fontSize={13}
            className="fill-muted font-mono"
          >
            {stage}
          </text>
        </g>
      ))}
    </svg>
  );
}
