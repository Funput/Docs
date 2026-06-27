# Funput Docs

Official documentation site for [Funput](https://funput.app) — an open-source Vietnamese input method for **macOS**, **Windows**, and **Linux**.

**Live site:** [docs.funput.app](https://docs.funput.app)

Built with [Docusaurus 3](https://docusaurus.io/). Default locale is **Vietnamese** (`vi`); **English** (`en`) is available via the locale switcher.

## Prerequisites

- [Node.js](https://nodejs.org/) **20+** (Node 26 recommended for Docker)
- [pnpm](https://pnpm.io/) (enabled via Corepack: `corepack enable`)

## Getting started

Install dependencies:

```bash
pnpm install
```

Start the development server (hot reload):

```bash
pnpm start
```

Open [http://localhost:3000](http://localhost:3000). English docs are at [http://localhost:3000/en](http://localhost:3000/en).

## Build

Generate static files into `build/`:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run serve
```

## Docker

Multi-stage image: Node 26 (build) + nginx alpine (serve).

```bash
docker build -t funput-docs .
docker run --rm -p 8080:80 funput-docs
```

Then open [http://localhost:8080](http://localhost:8080).

## Project layout

```
Docs/
├── docs/              # Vietnamese source (default locale)
├── i18n/en/           # English translations
├── src/               # React pages & components (homepage)
├── static/            # Images, favicon, etc.
├── docusaurus.config.ts
├── sidebars.ts
├── Dockerfile
└── nginx.conf
```

Installation guides live under `docs/install/` (`macos`, `windows`, `linux`).

## Editing docs

- Vietnamese content: edit files in `docs/`.
- English content: edit the matching files under `i18n/en/docusaurus-plugin-content-docs/current/`.
- Use relative links between docs (e.g. `install/macos`) so i18n routing works.
- Admonitions (Docusaurus v3): use bracket titles, e.g. `:::tip[My title]` — not `:::tip My title`.

After changing navbar/footer labels, update the corresponding JSON files in `i18n/en/docusaurus-theme-classic/` if needed.

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm start` | Dev server |
| `pnpm run build` | Production build |
| `pnpm run serve` | Serve `build/` locally |
| `pnpm run clear` | Clear Docusaurus cache |
| `pnpm run typecheck` | TypeScript check |

## Links

- **Main repository:** [github.com/Funput/Funput](https://github.com/Funput/Funput)
- **Releases:** [github.com/Funput/Funput/releases](https://github.com/Funput/Funput/releases)
- **Website:** [funput.app](https://funput.app)

## License

MIT — see [LICENSE](https://github.com/Funput/Funput/blob/main/LICENSE) in the main repository.
