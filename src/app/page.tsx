import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      {/* ------------------------------------------------------------------
          TEMPORARY SCAFFOLDING
          Gives the nav links and the hero's "View work" button somewhere to
          scroll, and puts real content under the hero so you can judge the
          sticky header + theme switcher in context. Replace this whole block
          with the real About / Work / Skills / Contact sections.
          scroll-mt-[62px] offsets the sticky header height on anchor jumps.
         ------------------------------------------------------------------ */}
      <section
        id="work"
        className="scroll-mt-[62px] border-t border-border bg-surface"
      >
        <div className="mx-auto flex min-h-screen max-w-[1080px] flex-col justify-center px-7 py-24">
          <span className="eyebrow">// placeholder</span>
          <h2 className="section-heading mt-4">Sections land here next.</h2>
          <div className="divider mt-5" />
          <p className="mt-5 max-w-[52ch] text-muted">
            About, Work, Skills, and Contact will replace this block. For now it
            exists so you can scroll past the hero, watch the header blur over
            content, and flip themes while judging how the node field feels.
          </p>
        </div>
      </section>

      {/* Anchor stubs so the remaining header links resolve */}
      <div id="about" className="scroll-mt-[62px]" />
      <div id="skills" className="scroll-mt-[62px]" />
      <div id="contact" className="scroll-mt-[62px]" />
    </>
  );
}
