export type ProjectGroupId = "client" | "apps" | "play";

export interface RepoLink {
  label: string;
  url: string;
}

export interface Project {
  name: string;
  url: string;
  description: string;
  tags: string[];
  group: ProjectGroupId;
  /* Local screenshot under /public — card thumbnail + modal poster/fallback. */
  image?: string;
  /* Longer write-up shown in the detail modal. Falls back to `description`. */
  longDescription?: string;
  /* YouTube video id (the part after /watch?v=). When set, the modal autoplays
     a muted scroll-through; otherwise it shows the static screenshot. Use an
     UNLISTED video. e.g. youtubeId: "dQw4w9WgXcQ" */
  youtubeId?: string;
  repos?: RepoLink[];
  wip?: boolean;
}

export const groups: { id: ProjectGroupId; index: string; label: string }[] = [
  { id: "client", index: "01", label: "client & production" },
  { id: "apps", index: "02", label: "apps & tools" },
  { id: "play", index: "03", label: "real-time & play" },
];

export const projects: Project[] = [
  // ---- Client & production ----
  {
    name: "Asia Industrial Estate",
    url: "https://www.asiaindustrialestate.com/en",
    image: "/projects/asia-industrial-estate.png",
    // youtubeId: "VIDEO_ID",
    description:
      "Multilingual corporate site (TH/EN/JP/CN) with a custom master-plan management system. Next.js frontend, headless WordPress, and a Vite + Express admin dashboard.",
    longDescription:
      "A four-language (Thai, English, Japanese, Chinese) corporate site for an industrial-estate developer, rebuilt from a legacy PHP site onto a Next.js frontend with a headless WordPress CMS. The centerpiece is a custom Master Plan Management System — an interactive map where staff annotate and manage land plots with zoom and pan, backed by a React (Vite) admin dashboard with search, filter, sort, and pagination. I hand-built the internationalization across all four languages, integrated WeChat and interactive Google Maps, and hardened the headless WordPress API with a custom plugin enforcing CORS policies, IP allowlisting, API-key authentication, and route whitelisting. The frontend runs on Vercel; the CMS and the Express + Prisma admin API run on Cloudways.",
    tags: ["Next.js", "WordPress", "Express", "Prisma", "i18n ×4"],
    group: "client",
  },
  {
    name: "Kailani Villa",
    url: "https://www.kailanivilla.com/",
    image: "/projects/kailani-villa.png",
    description:
      "Real-estate landing site built from a designer's Figma. Next.js + Tailwind frontend on headless WordPress.",
    longDescription:
      "A real-estate landing site for a villa development, built to a designer's Figma spec. A Next.js + Tailwind CSS frontend pulls its content from a headless WordPress CMS, so the client can update copy and imagery without touching code. The focus was a faithful translation of the design — spacing, typography, and imagery — into a fast, responsive page that holds up cleanly across devices.",
    tags: ["Next.js", "Tailwind", "WordPress", "Figma"],
    group: "client",
  },
  {
    name: "The Axis Utthayan",
    url: "https://www.theaxis-utthayan.com/th",
    image: "/projects/the-axis-utthayan.png",
    description:
      "Real-estate site with a custom TH/EN internationalization layer. Next.js + Tailwind on headless WordPress.",
    longDescription:
      "A real-estate marketing site following the same headless architecture as Kailani — Next.js + Tailwind on a WordPress CMS — with a custom Thai/English internationalization layer on top. I built the i18n so content editors manage both languages from the CMS while the frontend swaps locales cleanly, without pulling in a heavy library. The result is a bilingual site that stays fast and easy for the client to maintain.",
    tags: ["Next.js", "Tailwind", "WordPress", "custom i18n"],
    group: "client",
  },
  {
    name: "Vana Ratchapruek",
    url: "https://vana-ratchapruek-multilang.vercel.app/th",
    image: "/projects/vana-ratchapruek.png",
    description:
      "Real-estate site with a 10-theme switchable design system built on Tailwind v4 tokens. Currently in client review.",
    longDescription:
      "A real-estate site currently in client review, notable for its design system: a switchable, ten-theme palette built entirely on Tailwind v4 design tokens. Each theme is a set of CSS custom properties applied through a data attribute, so the whole site can be re-skinned instantly without touching component code. It shares the same headless Next.js + WordPress foundation as the other landing pages, with the theming layer as the standout piece.",
    tags: ["Next.js", "Tailwind v4", "theming"],
    group: "client",
    wip: true,
  },

  // ---- Apps & tools ----
  {
    name: "BSE Service Scheduler",
    url: "https://bse-service-scheduler-next-js.vercel.app/",
    image: "/projects/bse-service-scheduler.png",
    description:
      "Service-scheduling app with a Prisma data layer and cPanel-hosted database. Currently in client review.",
    longDescription:
      "A service-scheduling application (in client review) for managing appointments and resources. Built with Next.js and Tailwind on a Prisma data layer, with the database hosted on cPanel. The work centered on the data model and the scheduling logic — creating, viewing, and organizing service slots — behind a clean, responsive interface.",
    tags: ["Next.js", "Tailwind", "Prisma"],
    group: "apps",
    wip: true,
  },

  // ---- Real-time & play ----
  {
    name: "Sudo Pals",
    url: "https://sudo-pals.vercel.app/",
    image: "/projects/sudo-pals.png",
    description:
      "Sudoku with solo modes and real-time multiplayer rooms over Socket.IO. Next.js client, Express server.",
    longDescription:
      "A real-time multiplayer Sudoku game with solo modes (easy / medium / hard) and online rooms. The Next.js client talks to an Express server over Socket.IO, syncing board state between players in a shared room as they play. A self-driven project to get hands-on with WebSocket-based real-time state and room management.",
    tags: ["Next.js", "Express", "Socket.IO"],
    group: "play",
    repos: [
      { label: "Client", url: "https://github.com/papinwit-l/sudo_pals" },
      {
        label: "Server",
        url: "https://github.com/papinwit-l/sudo_pals_server",
      },
    ],
  },
  {
    name: "Reversi Online",
    url: "https://reversi-rho.vercel.app/",
    image: "/projects/reversi.png",
    description:
      "Real-time multiplayer Reversi with live game rooms over Socket.IO. React client, Express server.",
    longDescription:
      "A real-time multiplayer Reversi (Othello) game. Players join live game rooms where moves and board state sync instantly between opponents over Socket.IO, with an Express server managing rooms and turn state and a React client on the front. Started as a bootcamp capstone and extended into a working online game.",
    tags: ["React", "Express", "Socket.IO"],
    group: "play",
    repos: [
      { label: "Client", url: "https://github.com/papinwit-l/reversi" },
      { label: "Server", url: "https://github.com/papinwit-l/reversi_server" },
    ],
  },
];
