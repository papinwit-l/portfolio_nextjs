import { GithubIcon, Mail } from "@/components/shared/Icons";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-7 py-8">
        {/* Wordmark */}
        <span className="font-mono text-[15px] font-medium">
          <span className="text-muted">&gt;&nbsp;</span>
          <span className="text-accent">papinwit</span>
        </span>

        {/* Socials */}
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/papinwit-l"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted transition-colors hover:text-accent"
          >
            <GithubIcon size={17} />
          </a>
          <a
            href="mailto:pae.papinwit@gmail.com"
            aria-label="Email"
            className="text-muted transition-colors hover:text-accent"
          >
            <Mail size={18} strokeWidth={1.75} />
          </a>
        </div>

        {/* Copyright */}
        <span className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Papinwit Lertwassana · built with Next.js
        </span>
      </div>
    </footer>
  );
}
