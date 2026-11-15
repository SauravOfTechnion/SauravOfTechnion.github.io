# Saurav Ramachandra Rao — Personal Site

Production portfolio for **GitHub Pages** (`https://sauravoftechnion.github.io`), built with Next.js App Router, TypeScript, Tailwind CSS v4, and a rigorous **golden-ratio (φ = 1.618)** design system. Public project cards still link to `github.com/saurav997`.

## Stack

- Next.js (static `output: 'export'`) + React 19 + TypeScript
- Tailwind CSS v4 design tokens encoding the φ scale
- Procedural Three.js sculptures, loaded on demand into one shared WebGL canvas
- CSS entrance animation; motion controls and `prefers-reduced-motion` support
- `next-themes` dark / light / system
- Live GitHub metadata (stars, language, description) at **build time**

## Interactive field notes

An original green streamline landscape responds to the pointer. Warm mineral
paper sections tell the story of motion, perception, learning, and musical
feedback. The visual direction is informed by Genomines, with original artwork,
personal writing, and a portfolio-specific structure.

The violin is an original Blender model made for this portfolio, with a 355 mm
body, carved arched spruce and maple plates, actual f-hole openings, inlaid
purfling, a cambered fingerboard, carved bridge, scroll, ebony pegs, strings,
chinrest and separate bow. Both wood textures are embedded in the local GLB.
No model CDN or asset download is required at build or runtime.

Editable Blender source: `art/violin/violin.blend`. Regenerate the model and
studio renders with Blender's background mode and `scripts/build-violin.py`.
Run `node scripts/validate-model.mjs` to check geometry, materials, embedded
textures, and the GLB structure. GitHub Actions runs this before the static build.
The loading/WebGL fallback is a studio render of this same model.

`src/lib/sculptures.ts` builds the procedural and model-backed Three.js sculptures:
- **Hero & ObjectLab**: Concert Violin (`public/models/violin.glb`), Gyroscopic Guidance Stage (`flight`), Neural Constellation (`neural`), and Reward Feedback Knot (`learning`).
- **About — Geodesic Career Orbit (`orbit`)**: Armillary sphere with 5 glowing trajectory waypoints (`IIT Madras → JLR → BharatSemi → JPMorganChase → Technion`) connected by great-circle arcs.
- **Experience — Role-Specific 3D Instruments**:
  - `jpmorgan`: Octagonal Quant Vault emblem, 3D candlestick/yield-curve pillars, and orbiting TrustGPT ledger plates.
  - `semiconductor`: Multi-layer PCB & silicon wafer die with 64 gold QFP edge pins, 16 pulsing TensorRT compute cores, and an EO/IR optical reticle.
  - `jlr`: British Racing Green Grand-Tourer fastback silhouette with sculpted oval badge halo, rotating multi-spoke alloy wheels, wind-tunnel streamlines, and 360° ADAS LiDAR + Audionostics acoustic wave rings.

`src/components/object-lab.tsx` and `src/components/sculpture-pod.tsx` provide interactive 3D instrument pods, mode switching, telemetry strips, and motion controls across sections.

Drag horizontally or vertically to rotate (touch preserves vertical page scrolling).
Keyboard users can focus the sculpture, rotate with the arrow keys, and reset with
Home. Each object's action produces a visual response; the experience is silent.
Reduced motion retains the 3D objects and explicit controls while disabling idle
animation and using a static response. Rendering pauses offscreen and in hidden
tabs. WebGL failure leaves a lightweight illustration and the portfolio content.

`src/components/guidance-stage.tsx` owns renderer lifecycle, responsive sizing,
visibility, pointer input, and GPU resource disposal. Materials and geometries are
cached only for objects the visitor has selected. Pixel ratio is capped at 1.6.

## Proportions

| Token | Value |
| --- | --- |
| Base unit | 16px |
| Spacing | 10 · 16 · 26 · 42 · 68 · 110 |
| Type scale | `1rem × φⁿ` |
| Major / minor split | 61.8% / 38.2% |
| Card / visual aspect | ≈ 1.618∶1 |

The original φ constants remain in `src/lib/phi.ts`. The current layout uses
responsive typography and a 1.618:1 content split, with design tokens in
`src/app/globals.css`.

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
- Ink-blue / porcelain palette with copper, ice-blue, violet, and sea-glass accents
- Responsive layout from mobile → desktop, keyboard-accessible 3D controls

## License

Personal portfolio content © Saurav Ramachandra Rao. Source scaffolding may be reused with attribution.
