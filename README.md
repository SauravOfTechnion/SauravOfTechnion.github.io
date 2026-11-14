# Saurav Ramachandra Rao — Personal Site

Production portfolio for **GitHub Pages** (`https://sauravoftechnion.github.io`), built with Next.js App Router, TypeScript, Tailwind CSS v4, and a rigorous **golden-ratio (φ = 1.618)** design system. Public project cards still link to `github.com/saurav997`.

## Stack

- Next.js (static `output: 'export'`) + React 19 + TypeScript
- Tailwind CSS v4 design tokens encoding the φ scale
- Framer Motion (hero only; respects `prefers-reduced-motion`)
- `next-themes` dark / light / system
- Live GitHub metadata (stars, language, description) at **build time**

## Design system (φ)

| Token | Value |
| --- | --- |
| Base unit | 16px |
| Spacing | 10 · 16 · 26 · 42 · 68 · 110 |
| Type scale | `1rem × φⁿ` |
| Major / minor split | 61.8% / 38.2% |
| Card / visual aspect | ≈ 1.618∶1 |

Tokens live in `src/app/globals.css` and `src/lib/phi.ts`.

## Update projects

Edit **`src/data/projects.ts`**.

1. Add a curated entry (`repo`, `title`, `description`, `language`, `tags`, optional `featured: true`).
2. Rebuild — `src/lib/github.ts` merges live public API fields from `github.com/saurav997/<repo>`.
3. Commit and push to `main` (GitHub Actions deploys Pages).

Other content files:

| File | Purpose |
| --- | --- |
| `src/data/profile.ts` | Name, email, LinkedIn, narrative |
| `src/data/experience.ts` | Timeline + selected professional work |
| `src/data/publications.ts` | Papers |
| `src/data/skills.ts` | Skill groups |

**Contact policy:** only `saurav.rao@campus.technion.ac.il` and the public LinkedIn URL. No phone / personal Gmail / address.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build (GitHub Pages)

```bash
npm run build
```

Static files are written to `out/`.

### Deploy via GitHub Actions

1. This site is published from `SauravOfTechnion/SauravOfTechnion.github.io`.
2. Repo **Settings → Pages → Source**: GitHub Actions.
3. Push to `main` — workflow `.github/workflows/deploy.yml` builds and publishes `out/`.

### Manual deploy

```bash
npm run deploy
```

(`gh-pages` publishes the `out/` folder to the `gh-pages` branch.)

### Project site under a subpath

If the site is not a user/org root (`username.github.io`), set:

```bash
NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build
```

## Accessibility & quality

- Skip link, keyboard focus rings, semantic landmarks
- Dark-first with light mode; system preference supported
- WCAG-oriented contrast on charcoal / indigo / cool paper palette
- Responsive φ layout from mobile → desktop

## License

Personal portfolio content © Saurav Ramachandra Rao. Source scaffolding may be reused with attribution.
