import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* ---- Fonts (inject the CSS vars globals.css references) ---- */
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // TODO: set to your real deployed domain
  metadataBase: new URL("https://papinwit.dev"),
  title: "Papinwit Lertwassana — Full-Stack Developer",
  description:
    "Full-stack developer in Bangkok building production web apps end to end — Next.js, Express, Prisma, and headless WordPress — with a foundation in carrier-grade network infrastructure.",
  openGraph: {
    title: "Papinwit Lertwassana — Full-Stack Developer",
    description:
      "Full-stack developer building production web apps end to end, from frontend to the server it runs on.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Papinwit Lertwassana — Full-Stack Developer",
    description:
      "Full-stack developer building production web apps end to end, from frontend to the server it runs on.",
  },
};

/* ---- No-flash theme script ----
   Runs synchronously before paint: applies the saved theme so there's
   no flash of the default palette on reload. Validated against the
   known theme list. */
const THEME_IDS = [
  "signal-cyan",
  "terminal-green",
  "deep-indigo",
  "violet-dusk",
  "warm-ember",
  "ice-steel",
];
const NO_FLASH = `(function(){try{var t=localStorage.getItem('theme');if(t&&${JSON.stringify(
  THEME_IDS,
)}.indexOf(t)!==-1){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="signal-cyan"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* applies saved theme before paint */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
