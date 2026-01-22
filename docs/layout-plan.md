# Layout Plan

## Repo structure
- `contracts/tender-registry`
- `contracts/milestone-escrow`
- `contracts/vendor-reputation`
- `apps/web`
- `docs`
- `configs`

## Key product modules
- Tender creation and legal publishing workflow
- Bid submission and close-out transparency
- Milestone acceptance + fund release controls
- Public dashboard for spend accountability

## Runtime layout (monorepo)

| Path | Responsibility |
| --- | --- |
| `contracts/*` | Soroban smart contracts — source of truth for rules |
| `apps/web` | Next.js — marketing, dashboards, contributor UX |
| `apps/backend` | Fastify — integrations, optional server-side signing gateway |

See also `docs/SITE_MAP.md` for the web route backlog.
