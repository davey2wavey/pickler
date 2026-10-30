# pickler — resume note (Oct 29, 2026, 7:15 pm)

## Where things are

Repo: github.com/davey2wavey/pickler (public, branch protection on, 13 PRs merged, all green)
Mac: ~/Projects/pickler (main) · ~/Projects/pickler-site (site worktree) · ~/Projects/pickler-runway (runway worktree)

Live:
- pickler-site.vercel.app — grid + timeline views, view switch, case pages at /p/[slug], /ui design system
- pickler-runway.vercel.app — sign-in, "Try the demo", five-tab shell, Transactions tab working
- pickler-company-log.vercel.app — placeholder

Supabase project: pickler-runway (ref nmcmmacbszcxponrstwm). Migration + seed applied. Env vars set on Vercel and GitHub.

Docs in repo: CLAUDE.md (working rules), DECISIONS.md (why), apps/*/SPEC.md and SPEC-B.md (what each slice builds).

## What tomorrow is

1. Home page mock, Wahoo-level, in Claude chat. Compare side by side with wahooservices.co.uk. No code until approved.
2. Then build the hero/home as one site slice.
3. Runway slice C: Expected tab. Then Home and Reports.
4. Site view 1: live Runway embedded on the home page.

## How to restart (two terminals)

Site window:
```
cd ~/Projects/pickler-site && git checkout main && git pull && claude
```

Runway window:
```
cd ~/Projects/pickler-runway && git checkout main && git pull && claude
```

First prompt in either: `Read CLAUDE.md and DECISIONS.md. Then wait.`

Then paste whatever slice prompt Claude chat gives you.

## Loop, every slice

Spec → plan mode → approve (auto mode) → PR → CI green → you check preview → "merge" → next.

## Things to know

- If it asks about `rm -f "$S"/*.png`, answer Yes. Scratchpad only.
- Keep ~15 GB free. Pictures (252 GB) and Desktop (52 GB) go to the external drive.
- Docker Desktop must be running for runway unit tests.
- Vercel previews need no login; Vercel Authentication is off on all three.
- "Not built yet" tabs in Runway are intentional.
