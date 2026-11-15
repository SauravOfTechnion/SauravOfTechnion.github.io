import { SculpturePod } from "@/components/sculpture-pod";
import { experience, featuredWork } from "@/data/experience";

export function Experience() {
  return (
    <section
      id="experience"
      className="section-shell experience"
      aria-labelledby="experience-title"
    >
      <div className="section-head split-phi">
        <div>
          <p className="chapter-label">Career trajectory · Interactive 3D artifacts</p>
          <h2 id="experience-title">Experience</h2>
          <p className="section-lede">
            Impact across ADAS simulation, edge semiconductor perception, and production
            financial LLM agents — each role accompanied by an interactive 3D study of its
            domain.
          </p>
        </div>
        <p className="section-aside">
          Drag any role’s 3D instrument on the left to inspect its geometry, or trigger a
          domain pulse.
        </p>
      </div>

      <ol className="timeline">
        {experience.map((item, idx) => (
          <li key={item.org} className="timeline-item">
            <div className="timeline-meta">
              <div className="timeline-meta-top">
                <span className="timeline-index" aria-hidden="true">
                  0{idx + 1}
                </span>
                <div>
                  <span className="timeline-period">{item.period}</span>
                  {item.location ? (
                    <span className="timeline-location">{item.location}</span>
                  ) : null}
                </div>
              </div>
              <SculpturePod
                kind={item.sculpture.kind}
                badge={item.sculpture.badge}
                title={item.sculpture.title}
                subtitle={item.sculpture.subtitle}
                actionLabel={item.sculpture.action}
                telemetry={item.sculpture.telemetry}
                variant="experience"
              />
            </div>
            <div className="timeline-body">
              <div className="timeline-role-head">
                <p className="timeline-org">{item.org}</p>
                <h3>{item.role}</h3>
              </div>
              <ul className="timeline-highlights">
                {item.highlights.map((h) => (
                  <li key={h.slice(0, 40)}>{h}</li>
                ))}
              </ul>
              <div className="timeline-subsystems" aria-label="Key domain systems">
                {item.subsystems.map((sub) => (
                  <div key={sub.code} className="subsystem-card">
                    <span className="subsystem-code">{sub.code}</span>
                    <strong>{sub.name}</strong>
                    <p>{sub.detail}</p>
                  </div>
                ))}
              </div>
              <div className="tag-row" aria-label="Technologies">
                {item.tech.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="featured-work">
        <div className="featured-work-head">
          <div>
            <p className="chapter-label">Systems architecture</p>
            <h3>Selected professional work</h3>
          </div>
          <p className="section-lede compact">
            High-impact systems described without proprietary code — complementary to the
            public GitHub projects below.
          </p>
        </div>
        <div className="featured-grid">
          {featuredWork.map((work) => (
            <article key={work.title} className="featured-item">
              <div className="featured-item-top">
                <span className="featured-index">{work.index}</span>
                <span className="featured-org">{work.org}</span>
              </div>
              <h4>{work.title}</h4>
              <p>{work.blurb}</p>
              <div className="tag-row">
                {work.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
