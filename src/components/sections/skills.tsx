import { skillGroups } from "@/data/skills";

const groupMeta: Record<string, { index: string; subtitle: string; glyph: string }> = {
  Languages: {
    index: "01",
    subtitle: "Systems kernels to high-level orchestration",
    glyph: "⟨/⟩",
  },
  "AI / ML": {
    index: "02",
    subtitle: "World models, RL policies & grounded agents",
    glyph: "✳",
  },
  "Engineering / Simulation": {
    index: "03",
    subtitle: "Closed-loop SIL, UAV guidance & edge silicon",
    glyph: "⌁",
  },
  "Cloud & Tooling": {
    index: "04",
    subtitle: "Reproducible infrastructure & mobile deployment",
    glyph: "◈",
  },
};

export function Skills() {
  return (
    <section id="skills" className="section-shell skills" aria-labelledby="skills-title">
      <div className="section-head split-phi">
        <div>
          <p className="chapter-label">Technical stack</p>
          <h2 id="skills-title">Skills</h2>
          <p className="section-lede">
            The tools I reach for, from first principles to production.
          </p>
        </div>
        <p className="section-aside">
          Spanning low-level CUDA & C++ edge inference, Unreal simulation, and enterprise
          LLM agent architectures.
        </p>
      </div>
      <div className="skills-grid">
        {skillGroups.map((group) => {
          const meta = groupMeta[group.title] ?? {
            index: "00",
            subtitle: "",
            glyph: "·",
          };
          return (
            <div key={group.title} className="skill-group">
              <div className="skill-group-top">
                <span className="skill-index">{meta.index}</span>
                <span className="skill-glyph" aria-hidden="true">
                  {meta.glyph}
                </span>
              </div>
              <h3>{group.title}</h3>
              <p className="skill-subtitle">{meta.subtitle}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
