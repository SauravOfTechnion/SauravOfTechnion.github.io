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
          <h2 id="contact-title">Let’s make<br />something matter.</h2>
          <p className="section-lede">
            A research question, a collaboration, or a good conversation.
            I’d love to hear what you’re thinking about.
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
          © {new Date().getFullYear()} {profile.name}
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
