# pickler

Web work by David Pickler. One repo, three apps, one design system.

| App                             | What it does                                    | Live               |
| ------------------------------- | ----------------------------------------------- | ------------------ |
| [site](apps/site)               | Portfolio. One dataset, many views.             | _not deployed yet_ |
| [runway](apps/runway)           | Shows where money goes.                         | _not deployed yet_ |
| [company-log](apps/company-log) | Every post from a company's socials, one place. | _not deployed yet_ |

Shared code lives in `packages/` (ui, db, config). Scheduled jobs live in `workers/`.

## Run it

```
pnpm install
pnpm dev --filter site      # http://localhost:3000
pnpm dev --filter runway    # http://localhost:3001
pnpm dev --filter company-log  # http://localhost:3002
```

Checks: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:smoke`.

Local database: `pnpm db:start` (needs Docker Desktop running). Then copy `.env.example` to `apps/<app>/.env.local`.

## Deploy

Each app is its own Vercel project with the root directory set to its folder. Name the projects `pickler-site`, `pickler-runway`, `pickler-company-log`. CI waits for those preview deployments by name.

How decisions got made: [DECISIONS.md](DECISIONS.md). How to work here: [CLAUDE.md](CLAUDE.md).
