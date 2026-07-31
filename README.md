# Story Forge.AI — Web Frontend (V5 scaffold)

This is a real Next.js 14 / TypeScript / Tailwind project implementing the
core studio shell from the frontend spec — not a full build of every screen
in that spec. See "What's built" / "What's not" below before assuming
feature parity.

## Setup

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at your backend
npm run dev
```

Requires Node 18+. `npm install` needs network access — this project was
written in a sandboxed environment with no network, so **`npm install` has
never actually been run against it here**. See "How this was verified"
below for exactly what that means for correctness.

## What's built

- **Landing page** (`app/page.tsx` + `components/landing/LandingHero.tsx`) —
  a CSS-driven cinematic reveal (rising embers, falling title, Enter the
  Forge / Login / Create Account). See the comment in `LandingHero.tsx` for
  why this substitutes for the spec's 3D boy-on-an-invisible-bike sequence.
- **Auth pages** — login, register, forgot-password (`app/(auth)/*`), fully
  functional forms with validation and error states
  (`components/auth/AuthForm.tsx`), wired to `lib/api.ts`.
- **Dashboard shell** (`app/dashboard/layout.tsx`) — sidebar + topbar,
  matching the real nav list from the spec.
- **Dashboard home** (`app/dashboard/page.tsx`) — stat cards, recent
  projects; the backend-status line is a real `/health` call.
- **Movie workspace** (`app/dashboard/movies/[id]/page.tsx`) — the
  dockable/resizable 3-pane layout (scene tree / preview / inspector), style
  manager, and render console, with a real "Generate scene" button wired to
  `POST /generate/movie/v5`.
- **Design system** (`lib/tokens.ts`, `app/globals.css`) — the black/
  graphite/purple/gold-ember palette, Chakra Petch/Inter/JetBrains Mono
  type, as specified.

## What's NOT built

- Timeline (Premiere-style multi-track), storyboard editor, character/
  environment/asset managers, marketplace, memory manager, notifications,
  render settings panel, AI assistant chat panel — none of these exist yet.
  The nav links to them; the pages themselves aren't written.
- The 3D rigged landing sequence (see above).
- Dockable panels that can be **rearranged and saved as custom layouts** —
  current panels resize (real drag-to-resize, functional) but aren't
  detachable/re-orderable. A real docking library (e.g. `dockview`,
  `react-mosaic-component`) would be the next step for that specific
  requirement.

## Real backend gaps this frontend exposes rather than hides

Every one of these is called out with a comment at the call site in the
code, not just here:

- **No job queue.** `POST /generate/movie/v5` blocks until rendering
  finishes. The workspace's "Generate scene" button will sit in a loading
  state for as long as a real render takes — this is the same "stuck
  loading" issue from earlier, not yet fixed on the backend.
- **No auth routes.** `memory.py` has the login/register logic; `server.py`
  never exposes it over HTTP. The login/register forms will show a clear
  "not wired up yet" error rather than hang or fail silently.
- **No style-list endpoint.** `lib/types.ts` hardcodes the 5 real styles
  from `style/__init__.py`'s `AVAILABLE_STYLES` — keep these in sync by hand
  until `StyleManager.list_styles()` is exposed over HTTP.
- **No CPU/RAM telemetry, no `/jobs/{id}` status, no `/projects` endpoint.**
  `TopBar`'s CPU/RAM props are optional and unused by default; the render
  console takes jobs as a prop rather than polling; the dashboard's recent
  projects are placeholder rows. All marked in code comments.

## How this was verified (and what that does NOT mean)

There is no network access in the environment this was written in, so
`npm install` could not be run, and neither could `next dev` / `next build`
/ a real `tsc` against the actual `@types/react` and `next` packages.

What *was* done: every `.ts`/`.tsx` file here was run through `tsc` against
a hand-written, deliberately loose ambient type shim
(`typecheck-shims/react-shim.d.ts`, not part of the shipped app — delete it,
it's not imported by anything) that declares just enough of `react`,
`react-dom`, `next/*`, and `lucide-react`'s surface to catch **syntax
errors, typos in imports, and references to functions/exports that don't
exist**. It came back clean. That is a real, meaningful check — it is not
the same as a real type-check against the actual library types, and it
cannot catch logic bugs, incorrect prop shapes against the real Next.js
APIs, or runtime errors. Treat this as "the code is syntactically real
TypeScript/JSX that references consistent module surfaces," not "this is
guaranteed to build."

**Before deploying:** run `npm install && npm run typecheck && npm run
build` yourself and fix whatever the real toolchain finds — there will
likely be at least minor issues a loose shim can't catch (exact prop types
Next.js expects for `Metadata`, `params` on dynamic routes, etc.).
