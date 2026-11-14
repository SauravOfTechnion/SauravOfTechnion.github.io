import type { Project } from "@/data/projects";
import { profile } from "@/data/profile";

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 1.2l1.76 3.57 3.94.57-2.85 2.78.67 3.92L8 10.2l-3.52 1.84.67-3.92L2.3 5.34l3.94-.57L8 1.2z"
      />
    </svg>
  );
}

function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const href = project.url ?? `https://github.com/${profile.github}/${project.repo}`;

  return (
    <article className={`project-card${large ? " is-featured" : ""}`}>
      <div className="project-card-top">
        <div>
          <h3>
            <a href={href} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          </h3>
          <p className="project-repo">{profile.github}/{project.repo}</p>
        </div>
        <div className="project-stats" aria-label={`${project.stars ?? 0} stars`}>
          <StarIcon />
          <span>{project.stars ?? 0}</span>
        </div>
      </div>
      <p className="project-desc">{project.description}</p>
      <div className="project-card-foot">
        <span className="lang-dot" data-lang={project.language}>
          {project.language}
        </span>
        <div className="tag-row">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="section-shell projects"
      aria-labelledby="projects-title"
    >
      <div className="section-head split-phi">
        <div>
          <h2 id="projects-title">Projects</h2>
          <p className="section-lede">
            Public repositories from{" "}
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              @{profile.github}
            </a>
            . Stars refresh at build time from the GitHub API.
          </p>
        </div>
        <p className="section-aside">
          Centerpiece: simulation, world models, CUDA, on-device AI, and LLM tooling.
        </p>
      </div>

      {featured.length > 0 ? (
        <div className="projects-featured">
          {featured.map((project) => (
            <ProjectCard key={project.repo} project={project} large />
          ))}
        </div>
      ) : null}

      <div className="projects-grid">
        {rest.map((project) => (
          <ProjectCard key={project.repo} project={project} />
        ))}
      </div>
    </section>
  );
}
