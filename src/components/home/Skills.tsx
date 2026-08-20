import Reveal from "@/components/shared/Reveal";
import SkillFlow from "./SkillFlow";
import DecodeEffect from "@/components/shared/DecodeEffect";
import DecodeEffectLoop from "@/components/shared/DecodeEffectLoop";

const GROUPS: { label: string; items: string[] }[] = [
  {
    label: "frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite"],
  },
  {
    label: "backend",
    items: [
      "Node.js",
      "Express.js",
      "REST API",
      "Prisma ORM",
      "WordPress headless",
      "Socket.IO",
    ],
  },
  { label: "database", items: ["MySQL", "PostgreSQL", "MongoDB"] },
  {
    label: "infra & deploy",
    items: [
      "Linux",
      "Vercel",
      "Cloudways",
      "cPanel",
      "PM2",
      "SSL/TLS",
      "DNS",
      "SSH",
    ],
  },
  {
    label: "networking",
    items: ["MPLS", "BGP", "IS-IS", "IP VPN", "VLAN", "IPv4/IPv6"],
  },
  { label: "tools", items: ["Git", "Postman", "Figma", "Puppeteer"] },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="scroll-mt-[62px] border-t border-border bg-surface py-[90px]"
    >
      <div className="mx-auto max-w-[1080px] px-7">
        <DecodeEffectLoop holdMs={3000}>
          <span className="eyebrow">// stack</span>
        </DecodeEffectLoop>
        <DecodeEffect>
          <h2 className="section-heading mt-[18px]">Tools of the trade.</h2>
        </DecodeEffect>
        <div className="divider mt-5" />

        {/* Packet-flow pipeline — desktop only (labels shrink too far on mobile) */}
        <div className="mt-10 hidden md:block" aria-hidden="true">
          <SkillFlow />
        </div>

        {/* Skill groups */}
        <div className="mt-8 grid grid-cols-2 gap-[14px] md:grid-cols-3">
          {GROUPS.map((g, i) => (
            <Reveal key={g.label} delay={i * 70} className="h-full">
              <div className="h-full rounded-card bg-surface-2 p-5">
                <h3 className="font-mono text-xs uppercase tracking-wide text-accent">
                  {g.label}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-[7px]">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-md bg-bg px-2.5 py-1 text-[13px] text-muted"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
