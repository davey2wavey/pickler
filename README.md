# pickler

Web work by David Pickler. One repo, three apps, one design system.

| App                             | What it does                                    | Live                                                                     |
| ------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| [site](apps/site)               | Portfolio. One dataset, many views.             | [pickler-site.vercel.app](https://pickler-site.vercel.app)               |
| [runway](apps/runway)           | Shows where money goes.                         | [pickler-runway.vercel.app](https://pickler-runway.vercel.app)           |
| [company-log](apps/company-log) | Every post from a company's socials, one place. | [pickler-company-log.vercel.app](https://pickler-company-log.vercel.app) |

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

Each app is its own Vercel project with the root directory set to its folder. Name the projects `pickler-site`, `pickler-runway`, `pickler-company-log`. CI reads each preview URL from the comment Vercel posts on the PR, so keep "Preview Comments" on.

Previews are behind Vercel Authentication by default, which CI cannot pass. Either turn Vercel Authentication off for previews in each project (Settings, Deployment Protection) or create a Protection Bypass for Automation secret there and add it to GitHub as the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET`. The same secret works for all three projects only if you paste the same value into each.

How decisions got made: [DECISIONS.md](DECISIONS.md). How to work here: [CLAUDE.md](CLAUDE.md).
