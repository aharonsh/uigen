# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server with turbopack (port 3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest unit tests
npm run setup        # Install deps + prisma generate + prisma migrate dev
npm run db:reset     # Force reset Prisma migrations
```

All dev/build scripts include `NODE_OPTIONS='--require ./node-compat.cjs'` automatically.

## Architecture

UIGen is an AI-powered React component generator with live preview. Users chat with Claude to generate/modify components, which render in a sandboxed iframe.

### Core Flow

1. User sends prompt via chat interface (left panel)
2. `/api/chat/route.ts` streams responses from Claude using Vercel AI SDK
3. Claude uses tools (`str_replace_editor`, `file_manager`) to create/edit files in a **virtual file system** (in-memory, no disk writes)
4. Components render in an iframe via Babel client-side transformation (`jsx-transformer.ts`)
5. Right panel has Preview tab (live render) and Code tab (Monaco editor + file tree)

### Key Abstractions

- **VirtualFileSystem** (`lib/file-system.ts`) — In-memory file tree with Map-based storage. Serializes to JSON for DB persistence.
- **FileSystemContext** (`lib/contexts/file-system-context.tsx`) — React context managing VFS state and tool call execution.
- **ChatContext** (`lib/contexts/chat-context.tsx`) — Wraps `useAIChat` from `@ai-sdk/react`, pipes file system data to the chat API.
- **JSX Transformer** (`lib/transform/jsx-transformer.ts`) — Babel transformation with import resolution and placeholder module generation for missing files.
- **Provider** (`lib/provider.ts`) — Returns real Claude API (`claude-haiku-4-5`) or `MockLanguageModel` when no API key is set.

### Auth & Data

- JWT auth via `jose` library, stored in httpOnly cookies (7-day expiry)
- Prisma ORM with SQLite (`prisma/schema.prisma` — User + Project models)
- Project messages and file data stored as JSON strings in the DB
- Anonymous mode works without auth (virtual FS only, no persistence)

## Tech Stack

- Next.js 15 (App Router, turbopack), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui (new-york style, Radix primitives)
- Anthropic Claude via `@ai-sdk/anthropic` + Vercel AI SDK
- Monaco Editor for code editing
- Path alias: `@/*` → `./src/*`

## Code Style

- Use comments sparingly. Only comment complex code.

## Environment Variables

- `ANTHROPIC_API_KEY` — Optional; falls back to MockLanguageModel
- `JWT_SECRET` — Optional; defaults to `"development-secret-key"`
