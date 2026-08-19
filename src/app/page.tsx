import Hero from "@/components/hero/Hero";
import About from "@/components/home/About";
import Work from "@/components/home/Work";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Contact />

      {/* Stub so the Skills header link resolves until it's built */}
      <div id="skills" className="scroll-mt-[62px]" />
    </>
  );
}
