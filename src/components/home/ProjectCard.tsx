"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";

type LoadState = "loading" | "loaded" | "error";

export default function ProjectCard({ project }: { project: Project }) {
  // Start in "error" (show the name placeholder) when there's no image yet.
  const [state, setState] = useState<LoadState>(
    project.image ? "loading" : "error",
  );

  const showImage = Boolean(project.image) && state !== "error";

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-accent hover:bg-bg">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        {project.wip && (
          <span className="absolute right-[10px] top-[10px] z-10 rounded-[5px] border border-accent-2 bg-bg/70 px-[7px] py-[2px] font-mono text-[10px] text-accent-2">
            in progress
          </span>
        )}

        {state !== "loaded" && (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center font-mono text-xs text-muted">
            {state === "loading" ? "loading preview…" : project.name}
          </div>
        )}

        {showImage && (
          <Image
            src={project.image as string}
            alt={`Screenshot of ${project.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
            className={`object-cover object-top transition-opacity duration-500 ${
              state === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setState("loaded")}
            onError={() => setState("error")}
          />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-[10px] p-[18px]">
        {/* Title — switches to a mono console command on hover (no layout shift) */}
        <h3 className="font-display text-[18px] font-medium group-hover:font-mono">
          <span
            aria-hidden
            className="mr-1 font-mono text-accent opacity-0 transition-all duration-200 hidden group-hover:inline-block group-hover:opacity-100"
          >
            $
          </span>
          {project.name}
          {/* wrapper is what's toggled, so it doesn't fight the cursor's own animation */}
          <span aria-hidden className="ml-1 hidden group-hover:inline-block">
            <span className="terminal-cursor" />
          </span>
        </h3>

        {/* Description — output marker fades in on hover, text stays put */}
        <p className="flex-1 text-[13.5px] text-muted group-hover:font-mono">
          <span
            aria-hidden
            className="mr-1 font-mono text-accent/70 opacity-0 hidden group-hover:inline-block transition-all duration-200 group-hover:opacity-100"
          >
            &gt;
          </span>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-[6px]">
          {project.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-1 flex flex-wrap gap-4 border-t border-border pt-3 font-mono text-xs">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            Visit ↗
          </a>
          {project.repos?.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              {r.label} ↗
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
