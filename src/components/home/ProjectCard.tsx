"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";
import ProjectModal from "./ProjectModal";
import DecodeEffectHover from "../shared/DecodeEffectHover";

type LoadState = "loading" | "loaded" | "error";

export default function ProjectCard({ project }: { project: Project }) {
  // Start in "error" (show the name placeholder) when there's no image yet.
  const [state, setState] = useState<LoadState>(
    project.image ? "loading" : "error",
  );
  const [showModal, setShowModal] = useState(false);

  const showImage = Boolean(project.image) && state !== "error";

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-[transform,border-color,background-color] duration-200 hover:-translate-y-[3px] hover:border-accent hover:bg-bg">
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
        {/* Title — display at rest, mono command on hover (single line, no reflow) */}
        <h3 className="font-display text-[18px] font-medium group-hover:font-mono">
          {/* opacity-only gate: reserves width at rest, so no shift on hover */}
          <span
            aria-hidden
            className="mr-1 hidden font-mono text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:inline-block"
          >
            $
          </span>
          <DecodeEffectHover>
            <span>{project.name}</span>
          </DecodeEffectHover>
          {/* wrapper toggles display so it doesn't fight the cursor's own blink */}
          <span aria-hidden className="ml-1 hidden group-hover:inline-block">
            <span className="terminal-cursor" />
          </span>
        </h3>

        {/* Description — mono ALWAYS so the hover never reflows the card */}
        <div className="flex-1 text-[13.5px] text-muted group-hover:font-mono">
          <span
            aria-hidden
            className="mr-1 hidden text-accent/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:inline-block"
          >
            &gt;
          </span>
          <DecodeEffectHover>
            <span>{project.description}</span>
          </DecodeEffectHover>
        </div>

        <div className="flex flex-wrap gap-[6px]">
          {project.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-1 flex flex-wrap gap-4 border-t border-border pt-3 font-mono text-xs">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-accent transition-colors hover:text-accent-2"
          >
            Details
          </button>
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

      {showModal && (
        <ProjectModal project={project} onClose={() => setShowModal(false)} />
      )}
    </article>
  );
}
