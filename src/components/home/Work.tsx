import { groups, projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import DecodeEffect from "@/components/shared/DecodeEffect";
import DecodeEffectLoop from "@/components/shared/DecodeEffectLoop";

export default function Work() {
  return (
    <section
      id="work"
      className="scroll-mt-[62px] border-t border-border py-[90px]"
    >
      <div className="mx-auto max-w-[1080px] px-7">
        <DecodeEffectLoop holdMs={3000}>
          <span className="eyebrow">// selected work</span>
        </DecodeEffectLoop>
        <DecodeEffect>
          <h2 className="section-heading mt-[18px]">
            Things I’ve built & shipped.
          </h2>
        </DecodeEffect>

        {groups.map((group) => {
          const items = projects.filter((p) => p.group === group.id);
          if (items.length === 0) return null;
          return (
            <div key={group.id}>
              <div className="mb-[18px] mt-10 font-mono text-xs text-muted first:mt-8">
                <span className="text-accent">{group.index}</span> ·{" "}
                {group.label}
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
                {items.map((project) => (
                  <ProjectCard key={project.url} project={project} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
