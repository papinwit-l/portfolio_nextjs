"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/data/projects";
import DecodeEffect from "../shared/DecodeEffect";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleId = useId();

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // scroll lock
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      prevFocus?.focus(); // restore focus to whatever opened the modal
    };
  }, [onClose]);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showVideo = Boolean(project.video) && !reduced;

  // Belt-and-suspenders for muted autoplay (React can be inconsistent about
  // reflecting the muted attribute in time for the autoplay policy).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      /* autoplay blocked — poster stays visible, which is fine */
    });
  }, [showVideo]);

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex max-h-[90vh] w-full max-w-[900px] flex-col overflow-hidden rounded-card border border-border bg-surface"
      >
        {/* Close */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg/70 font-mono text-muted transition-colors hover:text-accent"
        >
          ✕
        </button>

        {/* Media — self-hosted video (no player chrome) with image poster/fallback */}
        <div className="relative aspect-video w-full shrink-0 bg-surface-2">
          {showVideo ? (
            <video
              ref={videoRef}
              src={project.video}
              poster={project.image}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`${project.name} walkthrough`}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={`Screenshot of ${project.name}`}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-muted">
              {project.name}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 overflow-y-auto p-6">
          <div className="flex items-center gap-3">
            <DecodeEffect>
              <h3 id={titleId} className="font-display text-2xl font-medium">
                {project.name}
              </h3>
            </DecodeEffect>
            <span className="terminal-cursor" />
            {project.wip && (
              <span className="rounded-[5px] border border-accent-2 px-[7px] py-[2px] font-mono text-[10px] text-accent-2">
                in progress
              </span>
            )}
          </div>

          <p className="leading-relaxed text-muted">
            {project.longDescription ?? project.description}
          </p>

          <div className="flex flex-wrap gap-[6px]">
            {project.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 border-t border-border pt-4 font-mono text-xs">
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
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
