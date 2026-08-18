# online-tools

Small, fast developer utilities that run entirely in the browser.
Bun + TypeScript + Solid, built with Vite. No server, no data, no tracking.

```bash
bun install
bun run dev        # dev server with HMR
bun test           # pure-logic tests
bun run typecheck
bun run build      # static site in dist/
```

`SITE_URL=https://example.com bun run build` emits absolute canonical URLs.

## Architecture

The shell owns navigation, search and shared services. Tools are self-contained
folders that know nothing about each other.

```
web/
  app/          shell: router, registry, services, sidebar + grid
  ui/           components shared across tools
  styles/       tokens.css, base.css, shell.css
  tools/<id>/   one folder per tool
scripts/        build helpers
```

Two contracts hold it together, both in `web/app/types.ts`:

- **`ToolManifest`** — static metadata (id, title, description, keywords,
  category). Single source of truth behind the sidebar, the grid, search,
  routing and each page's `<title>`/description. Imported eagerly; the
  implementation behind `load()` stays lazy, so each tool is its own chunk.
- **`ToolModule.mount(root, ctx)`** — renders into `root` and returns a cleanup
  function. Tools reach the outside world only through `ctx`
  (`toast`, `copy`, `params`, `setParams`, `navigate`) and never touch DOM
  outside their own root.

Because `mount` is framework-agnostic, a tool can be Solid, plain DOM, or
something else entirely without the shell caring.

## Adding a tool

1. Create `web/tools/<id>/` with:
   - `manifest.ts` — the metadata plus `load: () => import('./index')`
   - `<name>.ts` — pure logic, no DOM, so it can be unit tested
   - `index.tsx` — `mount()`, usually a one-liner around Solid's `render`
   - `styles.css` — scoped under `[data-tool="<id>"]`
2. Register it in `web/app/registry.ts`.

That is the whole checklist — routing, the sidebar entry, the grid card, search,
lazy loading and the per-tool static page all follow from the manifest.

## URLs

Each tool lives at `/<id>`, and tool state goes in the query string
(`/unix-permissions?mode=755`) so links reproduce exactly what you see.
`scripts/emit-pages.ts` gives every tool a real static page after the build,
with its own title, description and canonical.
