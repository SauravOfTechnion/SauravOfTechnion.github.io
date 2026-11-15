import { profile } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="section-shell about" aria-labelledby="about-title">
      <div className="section-head split-phi">
        <div>
          <h2 id="about-title">A little about my orbit.</h2>
          <p className="section-lede">
            From aerospace guidance laws to agentic AI — the same discipline,
            a wider flight envelope.
          </p>
        </div>
        <p className="section-aside">{profile.identity}</p>
      </div>
      <div className="about-body split-phi">
        <div className="about-prose">
          {profile.about.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        <aside className="about-meta" aria-label="Languages spoken">
          <h3>Languages</h3>
          <ul>
            {profile.languages.map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
