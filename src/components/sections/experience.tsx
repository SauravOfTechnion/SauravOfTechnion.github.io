import { experience, featuredWork } from "@/data/experience";

export function Experience() {
  return (
    <section
      id="experience"
      className="section-shell experience"
      aria-labelledby="experience-title"
    >
      <div className="section-head">
        <h2 id="experience-title">Experience</h2>
        <p className="section-lede">
          Impact across ADAS simulation, edge perception, and production LLM agents.
        </p>
      </div>

      <ol className="timeline">
        {experience.map((item) => (
          <li key={item.org} className="timeline-item">
            <div className="timeline-meta">
              <span className="timeline-period">{item.period}</span>
              {item.location ? (
                <span className="timeline-location">{item.location}</span>
              ) : null}
            </div>
            <div className="timeline-body">
              <h3>{item.role}</h3>
              <p className="timeline-org">{item.org}</p>
              <ul>
                {item.highlights.map((h) => (
                  <li key={h.slice(0, 40)}>{h}</li>
                ))}
              </ul>
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
        <h3>Selected professional work</h3>
        <p className="section-lede compact">
          High-impact systems described without proprietary code — complementary to
          the public GitHub projects below.
        </p>
        <div className="featured-grid">
          {featuredWork.map((work) => (
            <article key={work.title} className="featured-item">
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
