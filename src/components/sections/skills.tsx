import { skillGroups } from "@/data/skills";

export function Skills() {
  return (
    <section id="skills" className="section-shell skills" aria-labelledby="skills-title">
      <div className="section-head">
        <h2 id="skills-title">Skills</h2>
        <p className="section-lede">
          The tools I reach for, from first principles to production.
        </p>
      </div>
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <div key={group.title} className="skill-group">
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
