import Reveal from "@/components/shared/Reveal";
import DecodeHeading from "@/components/shared/DecodeHeading";

const STATS = [
  { n: "7+", l: "projects shipped" },
  { n: "4-lang", l: "i18n builds" },
  { n: "100%", l: "self-deployed" },
  { n: "8 yrs", l: "carrier-grade infra" },
];

export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-[62px] border-t border-border bg-surface py-[90px]"
    >
      <div className="mx-auto max-w-[1080px] px-7">
        <span className="eyebrow">// about</span>

        <div className="mt-[18px] grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-start">
          <Reveal>
            <DecodeHeading
              className="section-heading"
              text="I own the whole stack — down to the wire."
            />
            <div className="divider mt-5" />
            <p className="mt-4 max-w-[52ch] text-muted">
              I build{" "}
              <strong className="font-medium text-text">
                production web applications end to end
              </strong>
              : Next.js frontends, Express and Prisma APIs, headless WordPress,
              and the Linux servers, DNS, and SSL that bring them online. I
              don&rsquo;t just write the app &mdash; I deploy and harden it.
            </p>
            <p className="mt-4 max-w-[52ch] text-muted">
              That instinct comes from a{" "}
              <strong className="font-medium text-text">
                foundation in infrastructure
              </strong>{" "}
              &mdash; eight years running carrier-grade networks where downtime
              wasn&rsquo;t an option. The deep systems knowledge stayed; the
              craft moved to the web.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-[14px]">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 80} className="h-full">
                <div className="h-full rounded-card bg-surface-2 p-5">
                  <div className="font-mono text-[26px] font-medium text-accent">
                    {s.n}
                  </div>
                  <div className="mt-1.5 text-xs text-muted">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
