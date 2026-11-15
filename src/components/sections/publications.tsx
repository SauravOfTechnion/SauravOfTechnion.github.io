import { publications } from "@/data/publications";

function PublicationDiagram({ year }: { year: string }) {
  if (year === "2020") {
    return (
      <div className="pub-diagram" aria-hidden="true">
        <span className="pub-diagram-label">FIG. 01 · VARIABLE L1 GUIDANCE LAW</span>
        <svg viewBox="0 0 280 110">
          <g fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M16 90 C 90 88, 130 22, 260 20" strokeDasharray="4 3" opacity="0.55" />
            <path d="M52 78 Q 118 42 184 28" strokeWidth="1.6" />
            <line x1="52" y1="78" x2="184" y2="28" strokeDasharray="2 2" opacity="0.8" />
            <polygon points="58,72 44,83 52,78 49,68" fill="currentColor" />
            <circle cx="184" cy="28" r="4" fill="currentColor" />
            <path d="M84 66 A 36 36 0 0 0 76 54" />
          </g>
          <g fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.8">
            <text x="108" y="64">L₁(V, κ)</text>
            <text x="88" y="58">η</text>
            <text x="170" y="18">Ref path</text>
            <text x="16" y="24">a_s = 2V² sin(η) / L₁</text>
          </g>
        </svg>
      </div>
    );
  }
  return (
    <div className="pub-diagram" aria-hidden="true">
      <span className="pub-diagram-label">FIG. 02 · POST-OXIDATION KINETICS</span>
      <svg viewBox="0 0 280 110">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <line x1="24" y1="88" x2="258" y2="88" opacity="0.4" />
          <line x1="24" y1="18" x2="24" y2="88" opacity="0.4" />
          <path d="M28 80 C 62 18, 96 18, 136 52 S 208 76, 252 82" strokeWidth="1.6" />
          <path
            d="M48 34 C 98 38, 146 64, 252 74"
            strokeDasharray="4 2"
            opacity="0.75"
          />
          <circle cx="118" cy="39" r="3.5" fill="currentColor" />
        </g>
        <g fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.8">
          <text x="72" y="24">T_exh peak</text>
          <text x="130" y="38">Post-oxidation zone</text>
          <text x="186" y="66">HC / CO decay</text>
          <text x="32" y="100">Crank angle θ (deg ATDC) →</text>
        </g>
      </svg>
    </div>
  );
}

export function Publications() {
  return (
    <section
      id="publications"
      className="section-shell publications"
      aria-labelledby="publications-title"
    >
      <div className="section-head split-phi">
        <div>
          <p className="chapter-label">Peer-reviewed research</p>
          <h2 id="publications-title">Publications</h2>
          <p className="section-lede">
            Guidance research and engine-emissions work spanning aerospace and mechanical
            engineering.
          </p>
        </div>
        <p className="section-aside">
          First-principles mathematical modeling paired with experimental & simulation
          validation.
        </p>
      </div>
      <ul className="pub-list">
        {publications.map((pub) => (
          <li key={pub.title} className="pub-item">
            <div className="pub-year">{pub.year}</div>
            <div className="pub-body">
              <h3>
                {pub.href ? (
                  <a href={pub.href} target="_blank" rel="noopener noreferrer">
                    {pub.title}
                  </a>
                ) : (
                  pub.title
                )}
              </h3>
              <p className="pub-authors">{pub.authors}</p>
              <p className="pub-venue">{pub.venue}</p>
              <div className="pub-flags">
                <span className={`status-pill status-${pub.status}`}>
                  {pub.status === "published" ? "Published" : "Under review"}
                </span>
                {pub.note ? <span className="pub-note">{pub.note}</span> : null}
              </div>
            </div>
            <PublicationDiagram year={pub.year} />
          </li>
        ))}
      </ul>
    </section>
  );
}
