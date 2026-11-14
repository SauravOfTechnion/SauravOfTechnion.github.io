import { projects as curated, type Project } from "@/data/projects";
import { profile } from "@/data/profile";

type GhRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
};

async function fetchRepo(repo: string): Promise<GhRepo | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${profile.github}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "saurav-portfolio",
        },
        // Static export: resolve once at build time.
        cache: "force-cache",
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as GhRepo;
  } catch {
    return null;
  }
}

/** Merge curated project copy with live public GitHub metadata. */
export async function getEnrichedProjects(): Promise<Project[]> {
  const enriched = await Promise.all(
    curated.map(async (project) => {
      const live = await fetchRepo(project.repo);
      if (!live) {
        return {
          ...project,
          url: `https://github.com/${profile.github}/${project.repo}`,
          stars: project.stars ?? 0,
          forks: project.forks ?? 0,
        };
      }
      return {
        ...project,
        // Keep curated storytelling copy; pull live stars/language/url from GitHub.
        language: live.language ?? project.language,
        stars: live.stargazers_count,
        forks: live.forks_count,
        url: live.html_url,
        updatedAt: live.updated_at,
      };
    }),
  );

  return enriched.sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    return (b.stars ?? 0) - (a.stars ?? 0);
  });
}
