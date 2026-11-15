"use client";

import { useState, type PointerEvent } from "react";
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

function FeaturedSchematic({ repo }: { repo: string }) {
  if (repo === "WorldModel") {
    return (
      <svg className="project-schematic" viewBox="0 0 360 88" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <polygon points="18,16 54,28 54,60 18,72" opacity="0.7" />
          <circle cx="96" cy="44" r="16" strokeDasharray="3 2" />
          <circle cx="96" cy="44" r="4" fill="currentColor" />
          <rect x="142" y="24" width="66" height="40" rx="4" />
          <path d="M154 44c10-12 20 12 30 0s12-8 16 0" opacity="0.8" />
          <circle cx="256" cy="44" r="15" />
          <path d="M256 29v30M241 44h30" opacity="0.4" />
          <path d="M54 44h26M112 44h30M208 44h33" />
          <path d="M271 44h52v32H36V66" strokeDasharray="4 3" opacity="0.55" />
        </g>
        <g fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.75">
          <text x="20" y="12">ConvVAE</text>
          <text x="86" y="22">z ~ N</text>
          <text x="150" y="19">MDN-RNN</text>
          <text x="240" y="22">CMA-ES</text>
          <text x="285" y="38">action a_t</text>
        </g>
      </svg>
    );
  }
  if (repo === "Dreamer_V3_sim") {
    return (
      <svg className="project-schematic" viewBox="0 0 360 88" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="38" cy="46" r="12" />
          <circle cx="104" cy="46" r="12" />
          <circle cx="174" cy="26" r="10" strokeDasharray="3 2" />
          <circle cx="174" cy="64" r="10" strokeDasharray="3 2" />
          <circle cx="244" cy="18" r="8" opacity="0.7" />
          <circle cx="244" cy="44" r="8" opacity="0.7" />
          <circle cx="244" cy="70" r="8" opacity="0.7" />
          <path d="M50 46h42M116 42l48-14M116 50l48 12M184 24l52-6M184 28l52 14M184 64l52 6" />
          <path d="M274 68c16-2 26-18 42-38s22-14 30-14" opacity="0.8" />
        </g>
        <g fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.75">
          <text x="28" y="26">h_t, z_t</text>
          <text x="92" y="26">RSSM</text>
          <text x="155" y="12">Imagined rollout</text>
          <text x="275" y="22">symlog V(s)</text>
        </g>
      </svg>
    );
  }
  if (repo === "Reinforcement-Learning-tuned-LLM-Based-Code-Reviewer") {
    return (
      <svg className="project-schematic" viewBox="0 0 360 88" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="18" y="24" width="64" height="40" rx="4" />
          <rect x="122" y="16" width="76" height="24" rx="4" />
          <rect x="122" y="50" width="76" height="24" rx="4" strokeDasharray="3 2" />
          <polygon points="248,22 302,44 248,66" />
          <path d="M82 36l40-8M82 52l40 10M198 28l50 12M198 62l50-14" />
          <path d="M302 44h36v36H50V64" strokeDasharray="3 3" opacity="0.55" />
        </g>
        <g fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.75">
          <text x="28" y="47">Git Diff</text>
          <text x="136" y="31">Policy π_θ</text>
          <text x="136" y="65">Ref π_ref</text>
          <text x="254" y="47">R_φ − βKL</text>
        </g>
      </svg>
    );
  }
  return (
    <svg className="project-schematic" viewBox="0 0 360 88" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        {[0, 1, 2].map((layer) => {
          const ox = 24 + layer * 28;
          const oy = 16 + layer * 6;
          return (
            <g key={layer} opacity={1 - layer * 0.22}>
              <polygon points={`${ox + 34},${oy} ${ox + 78},${oy + 14} ${ox + 44},${oy + 34} ${ox},${oy + 20}`} />
              <polygon points={`${ox},${oy + 20} ${ox + 44},${oy + 34} ${ox + 44},${oy + 48} ${ox},${oy + 34}`} />
              <polygon points={`${ox + 44},${oy + 34} ${ox + 78},${oy + 14} ${ox + 78},${oy + 28} ${ox + 44},${oy + 48}`} />
            </g>
          );
        })}
        <path d="M180 44h48M236 24h96v40h-96z" />
        <path d="M248 34h72M248 44h72M248 54h72" opacity="0.55" />
      </g>
      <g fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.75">
        <text x="24" y="14">3D Thread Blocks</text>
        <text x="182" y="36">Warp×32</text>
        <text x="248" y="19">Shared SRAM Tile</text>
      </g>
    </svg>
  );
}

const filters = [
  { id: "all", label: "All systems", match: () => true },
  {
    id: "rl-world",
    label: "World Models & RL",
    match: (p: Project) =>
      p.tags.some((t) => ["World Models", "RL", "DreamerV3", "DQN", "RLHF", "VAE"].includes(t)),
  },
  {
    id: "llm-ai",
    label: "LLMs, RAG & Generative",
    match: (p: Project) =>
      p.tags.some((t) =>
        ["LLM", "RAG", "RLHF", "Transformers", "Diffusion", "GANs", "Generative"].includes(t),
      ),
  },
  {
    id: "cuda-sim",
    label: "CUDA & Simulation",
    match: (p: Project) =>
      p.tags.some((t) => ["CUDA", "GPU", "Drones", "Simulation", "Unreal", "Game AI"].includes(t)),
  },
  {
    id: "android-ux",
    label: "On-Device & UX",
    match: (p: Project) =>
      p.tags.some((t) => ["Android", "Compose", "ML Kit", "Productivity", "Climate"].includes(t)),
  },
] as const;

function handleCardPointerMove(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rx = (0.5 - y) * 5.5;
  const ry = (x - 0.5) * 6.5;
  card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
  card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
  card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
  card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
}

function handleCardPointerLeave(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
}

function ProjectCard({
  project,
  large = false,
  dimmed = false,
}: {
  project: Project;
  large?: boolean;
  dimmed?: boolean;
}) {
  const href = project.url ?? `https://github.com/${profile.github}/${project.repo}`;

  return (
    <article
      className={`project-card${large ? " is-featured" : ""}`}
      data-dimmed={dimmed ? "true" : "false"}
      onPointerMove={handleCardPointerMove}
      onPointerLeave={handleCardPointerLeave}
    >
      {large ? <FeaturedSchematic repo={project.repo} /> : null}
      <div className="project-card-top">
        <div>
          <h3>
            <a href={href} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          </h3>
          <p className="project-repo">
            {profile.github}/{project.repo}
          </p>
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
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const currentFilter = filters.find((f) => f.id === activeFilter) ?? filters[0];

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
          <p className="chapter-label">Open-source research & systems</p>
          <h2 id="projects-title">Ideas, made real.</h2>
          <p className="section-lede">
            Public repositories from{" "}
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              @{profile.github}
            </a>
            . Open experiments in intelligence, simulation, and useful software.
          </p>
        </div>
        <p className="section-aside">
          Built to understand something. Shared so others can, too. Hover any card to
          inspect in 3D perspective.
        </p>
      </div>

      <div className="project-filters" role="group" aria-label="Filter projects by domain">
        {filters.map((filter) => {
          const count = projects.filter(filter.match).length;
          return (
            <button
              key={filter.id}
              type="button"
              className="project-filter-btn"
              aria-pressed={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              <span>{filter.label}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {featured.length > 0 ? (
        <div className="projects-featured">
          {featured.map((project) => (
            <ProjectCard
              key={project.repo}
              project={project}
              large
              dimmed={!currentFilter.match(project)}
            />
          ))}
        </div>
      ) : null}

      <div className="projects-grid">
        {rest.map((project) => (
          <ProjectCard
            key={project.repo}
            project={project}
            dimmed={!currentFilter.match(project)}
          />
        ))}
      </div>
    </section>
  );
}
