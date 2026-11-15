import { SculpturePod } from "@/components/sculpture-pod";
import { profile } from "@/data/profile";

const orbitNodes = [
  { code: "01", place: "IIT Madras", note: "B.Tech Aerospace · AIR 2588" },
  { code: "02", place: "Jaguar Land Rover", note: "ADAS Systems & UE5 SIL" },
  { code: "03", place: "BharatSemi / 3rdiTech", note: "Jetson Orin & EO/IR AI" },
  { code: "04", place: "JPMorganChase", note: "Asset & Wealth LLM Agents" },
  { code: "05", place: "Technion · Haifa", note: "Incoming M.Sc. Mechanical Eng" },
] as const;

export function About() {
  return (
    <section id="about" className="section-shell about" aria-labelledby="about-title">
      <div className="section-head split-phi">
        <div>
          <p className="chapter-label">Trajectory & background</p>
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

          <div className="orbit-waypoints" aria-label="Academic and professional orbit">
            {orbitNodes.map((node) => (
              <div key={node.code} className="orbit-waypoint">
                <span className="orbit-code">{node.code}</span>
                <div>
                  <strong>{node.place}</strong>
                  <span>{node.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="about-meta" aria-label="3D career orbit and languages spoken">
          <SculpturePod
            kind="orbit"
            badge="ARMILLARY · 5 WAYPOINTS"
            title="Geodesic Career Orbit"
            subtitle="Great-circle flight arcs · Chennai to Haifa"
            actionLabel="Advance orbital probe"
            telemetry={["IITM · AIR 2588", "JLR · JPM", "TECHNION M.SC."]}
            variant="orbit"
          />
          <div className="about-languages">
            <h3>Languages spoken</h3>
            <ul>
              {profile.languages.map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
