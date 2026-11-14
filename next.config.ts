import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages (SauravOfTechnion.github.io).
 * For a project-site under /repo-name, set basePath/assetPrefix via env.
 */
const repoBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: repoBase || undefined,
  assetPrefix: repoBase || undefined,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
