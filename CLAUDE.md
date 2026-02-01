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
bun run db:push      # Push schema changes to database (development)
bun run db:generate  # Generate migration files
bun run db:migrate   # Run migrations (production)
bun run db:studio    # Open Drizzle Studio GUI
bun run seed         # Seed database with sample questions
```

## Testing

```bash
bun test             # Run tests with Bun's built-in test runner
bun test path/to/file.test.ts  # Run a single test file
```

## Environment Setup

Copy `.env.example` to `.env.local` and configure:
- `DATABASE_URL` - PostgreSQL connection string (Neon recommended for dev)
- `BETTER_AUTH_SECRET` - Auth secret key
- OAuth credentials for Google/Facebook (optional)

## Architecture Overview

### Stack
- **Runtime**: Bun (not Node.js)
- **Framework**: Next.js 16 with App Router and React 19
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth with OAuth providers (Google, Facebook)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Real-time**: Server-Sent Events (SSE)

### Project Structure

**`app/`** - Next.js App Router
- `(auth)/` - Login pages (route group, no layout nesting)
- `(dashboard)/` - Protected routes (dashboard, groups, leaderboard, test)
- `api/auth/[...all]/route.ts` - Better Auth catch-all handler
- `api/sse/` - SSE endpoints for real-time updates

**`lib/`** - Core business logic
- `db/schema.ts` - Drizzle schema definitions with type exports
- `db/index.ts` - Database connection (exports `db` instance)
- `auth/index.ts` - Better Auth configuration
- `auth/client.ts` - Client-side auth utilities
- `actions/` - Server Actions (use `"use server"` directive)
- `sse/client.ts` - SSE client utilities

**`components/`** - React components
- `ui/` - Shadcn UI base components (button, card, input, etc.)
- Feature components organized by domain (groups/, leaderboard/, test/)

### Key Patterns

**Server Actions**: Located in `lib/actions/`. Always start with `"use server"` directive. Import db and schema from `@/lib/db`.

**Database**: Drizzle ORM with postgres.js driver. Schema types are exported from `lib/db/schema.ts` (e.g., `User`, `NewUser`).

**SSE Pattern**: API routes return `ReadableStream` with `text/event-stream` content type. Clients use `EventSource` for real-time leaderboard updates.

**Path Aliases**: Use `@/` for imports from project root (e.g., `@/lib/db`, `@/components/ui/button`).

## Bun-Specific Notes

- Use `bun` commands instead of npm/node/npx
- Bun auto-loads `.env` files (though this project uses dotenv for drizzle.config.ts)
- For new standalone scripts, run with `bun run <file.ts>`
