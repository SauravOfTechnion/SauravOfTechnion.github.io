import { profile } from "@/data/profile";

export function Contact() {
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    "Hello from your portfolio site",
  )}`;

  return (
    <section
      id="contact"
      className="section-shell contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-panel split-phi">
        <div>
          <h2 id="contact-title">Contact</h2>
          <p className="section-lede">
            Public channels only — Technion campus email and LinkedIn.
          </p>
        </div>
        <div className="contact-actions">
          <a className="btn btn-primary" href={mailto}>
            {profile.email}
          </a>
          <a
            className="btn btn-secondary"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn profile
          </a>
        </div>
      </div>
      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {profile.name}. Layout proportions follow φ =
          1.618.
        </p>
        <p>
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
            github.com/{profile.github}
          </a>
        </p>
      </footer>
    </section>
  );
}
