import { publications } from "@/data/publications";

export function Publications() {
  return (
    <section
      id="publications"
      className="section-shell publications"
      aria-labelledby="publications-title"
    >
      <div className="section-head">
        <h2 id="publications-title">Publications</h2>
        <p className="section-lede">
          Guidance research and engine-emissions work spanning aerospace and mechanical
          engineering.
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
                <span
                  className={`status-pill status-${pub.status}`}
                >
                  {pub.status === "published" ? "Published" : "Under review"}
                </span>
                {pub.note ? <span className="pub-note">{pub.note}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
