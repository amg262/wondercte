# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
bun install          # Install dependencies (always use bun, not npm/yarn/pnpm)
bun run dev          # Start dev server with Turbopack at localhost:3000
bun run build        # Production build
bun run start        # Start production server
bun run lint         # ESLint
```

## Database Commands

```bash
bun run db:push          # Push schema changes to database (development)
bun run db:generate      # Generate migration files
bun run db:migrate       # Run migrations (production)
bun run db:studio        # Open Drizzle Studio GUI
bun run db:clear         # Wipe test data (lib/db/clear-data.ts)
bun run seed              # Seed the test_questions bank
bun run seed:leaderboard  # Seed demo users + test attempts for leaderboard testing
bun run seed:nfl          # Seed nfl_players table (Wonderlic comparison data)
```

## Testing

There is no test suite in this repo yet (no `*.test.ts` files, no `test` script in `package.json`). Per `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`, use Bun's built-in runner if you add tests:

```bash
bun test                       # Run all tests
bun test path/to/file.test.ts  # Run a single test file
```

## Environment Setup

Copy `.env.example` to `.env.local` and configure:
- `DATABASE_URL` - PostgreSQL connection string (Neon recommended for dev)
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` - Auth secret key and base URL
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth (optional)
- `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` - Facebook OAuth (optional)
- `NEXT_PUBLIC_APP_URL` - public app URL, used by the client auth helper

## Architecture Overview

### Stack
- **Runtime**: Bun (not Node.js)
- **Framework**: Next.js 16 with App Router and React 19
- **Database**: PostgreSQL with Drizzle ORM (postgres.js driver)
- **Auth**: Better Auth with OAuth providers (Google, Facebook) — no email/password
- **Styling**: Tailwind CSS + Shadcn UI components
- **Real-time**: Server-Sent Events (SSE), polling every 10s — no WebSockets

### Project Structure

**`app/`** - Next.js App Router
- `(auth)/login/` - Login page (route group, no layout nesting)
- `(dashboard)/` - Protected routes: `dashboard/`, `groups/[groupId]/`, `leaderboard/`, `test/`, `users/[userId]/`. There is no `middleware.ts` — each page protects itself by calling `auth.api.getSession()` server-side and `redirect("/login")` if absent.
- `algorithm/page.tsx` - Public marketing/explainer page describing the ACE (Adaptive Cognitive Efficiency) scoring concept from `ctealgo.md`. This is a spec/pitch document, not yet implemented — current scoring in `lib/actions/test.ts` is a simple `(correctCount / totalQuestions) * 50` Wonderlic-scale calculation, not the time-decay/difficulty-adaptive ACE model described there.
- `api/auth/[...all]/route.ts` - Better Auth catch-all handler
- `api/sse/leaderboard/route.ts` - SSE endpoint; accepts `?groupId=` to scope to a group leaderboard vs global

**`lib/`** - Core business logic
- `db/schema.ts` - Drizzle schema definitions with type exports (`User`, `NewUser`, `TestAttempt`, `Group`, `NflPlayer`, etc.)
- `db/index.ts` - Database connection (exports `db` instance and re-exports all schema)
- `auth/index.ts` - Better Auth server config (Drizzle adapter, OAuth providers)
- `auth/client.ts` - Client-side auth utilities (`authClient` from `better-auth/react`)
- `actions/` - Server Actions: `test.ts`, `leaderboard.ts`, `groups.ts`, `user-profile.ts`, `nfl-comparison.ts`
- `sse/client.ts` - SSE client hook utilities

**`components/`** - React components
- `ui/` - Shadcn UI base components (button, card, input, avatar)
- Feature components organized by domain: `test/`, `leaderboard/`, `groups/`, `nfl/`, `social/`

### Key Patterns

**Server Actions**: Located in `lib/actions/`. Always start with `"use server"` directive. Import db and schema from `@/lib/db`.

**Database**: Drizzle ORM with postgres.js driver. Schema types are exported from `lib/db/schema.ts`.

**SSE Pattern**: API routes return `ReadableStream` with `text/event-stream` content type, pushing an update on connect and then every 10s via `setInterval`, cleaned up on `request.signal` abort. Clients use `EventSource`.

**Path Aliases**: Use `@/` for imports from project root (e.g., `@/lib/db`, `@/components/ui/button`).

**⚠️ Dual user-identity model**: There are two separate "user" tables that are *not* synced:
- `user` (text `id`) — owned by Better Auth; holds OAuth identity, sessions, accounts.
- `users` (uuid `id`) — the original app table; `testAttempts`, `groups`, and `groupMembers` all FK against `users.id`, and `lib/actions/*` query against it.

Pages like `app/(dashboard)/test/page.tsx` and `dashboard/page.tsx` currently pass `session.user.id` (from the Better Auth `user` table) straight into actions that expect a `users.id` uuid (e.g. `submitTestAttempt`, `getUserTestHistory`). Nothing in the codebase creates a matching `users` row when a person signs in via OAuth — the `users` table is only populated by the seed scripts. Treat any user-identity work here as touching a real inconsistency, not an established convention to copy.

## Bun-Specific Notes

- Use `bun` commands instead of npm/node/npx
- Bun auto-loads `.env` files (though this project uses dotenv for `drizzle.config.ts`)
- For new standalone scripts, run with `bun run <file.ts>`
