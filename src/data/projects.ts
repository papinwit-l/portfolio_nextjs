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
  /* Local screenshot under /public. Drop a file at this path to show it;
     until then the card falls back to the project name. */
  image?: string;
  repos?: RepoLink[];
  wip?: boolean;
}

/* Group headers, in display order. */
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
    description:
      "Multilingual corporate site (TH/EN/JP/CN) with a custom master-plan management system. Next.js frontend, headless WordPress, and a Vite + Express admin dashboard.",
    tags: ["Next.js", "WordPress", "Express", "Prisma", "i18n ×4"],
    group: "client",
  },
  {
    name: "Kailani Villa",
    url: "https://www.kailanivilla.com/",
    image: "/projects/kailani-villa.png",
    description:
      "Real-estate landing site built from a designer's Figma. Next.js + Tailwind frontend on headless WordPress.",
    tags: ["Next.js", "Tailwind", "WordPress", "Figma"],
    group: "client",
  },
  {
    name: "The Axis Utthayan",
    url: "https://www.theaxis-utthayan.com/th",
    image: "/projects/the-axis-utthayan.png",
    description:
      "Real-estate site with a custom TH/EN internationalization layer. Next.js + Tailwind on headless WordPress.",
    tags: ["Next.js", "Tailwind", "WordPress", "custom i18n"],
    group: "client",
  },
  {
    name: "Vana Ratchapruek",
    url: "https://vana-ratchapruek-multilang.vercel.app/th",
    image: "/projects/vana-ratchapruek.png",
    description:
      "Real-estate site with a 10-theme switchable design system built on Tailwind v4 tokens. Currently in client review.",
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
    tags: ["React", "Express", "Socket.IO"],
    group: "play",
    repos: [
      { label: "Client", url: "https://github.com/papinwit-l/reversi" },
      { label: "Server", url: "https://github.com/papinwit-l/reversi_server" },
    ],
  },
];
