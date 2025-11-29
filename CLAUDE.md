# CLAUDE.md - Project Guide for AI Assistants

This document explains how the MemoryBench project works and the development practices to follow.

## Project Overview

MemoryBench is a personal knowledge base application built with:
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel AI SDK 6** - Chat functionality with streaming
- **Anthropic Claude** - AI model (claude-haiku-4-5)

## Project Structure

```
memorybench/
├── app/                    # Next.js app directory
│   ├── api/chat/          # Chat API endpoint
│   ├── file/[...slug]/    # Dynamic file routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (chat interface)
├── agents/                 # Agent configurations
│   ├── SystemPrompt.md    # Main agent system prompt
│   ├── enterprise-plugin/ # Enterprise features plugin
│   └── memorybench-plugin/# Core memory features plugin
├── components/            # React components
│   ├── ChatInterface.tsx  # Main chat UI
│   ├── FileExplorer.tsx   # File sidebar
│   └── Navigation.tsx     # Top navigation
├── content/               # Markdown content files
├── lib/                   # Utility functions
└── public/                # Static assets
```

## Running the Project

### Development Server

Always use pnpm to run the development server:

```bash
pnpm run dev
```

The server runs at `http://localhost:3000`

### Environment Setup

Create a `.env.local` file with:

```
ANTHROPIC_API_KEY=your-api-key-here
```

## Git Workflow

**IMPORTANT: Never commit directly to main.**

### Creating Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add -A
   git commit -m "Description of changes"
   ```

3. Push the branch and open a PR using GitHub CLI:
   ```bash
   git push -u origin feature/your-feature-name
   gh pr create --title "Your PR title" --body "Description of changes"
   ```

4. Wait for approval, then merge:
   ```bash
   gh pr merge --squash
   ```

5. Return to main and pull:
   ```bash
   git checkout main
   git pull
   ```

### Reviewing PRs

When the user asks to "review the PR", check the PR diff and provide feedback:

```bash
# View PR diff
gh pr diff

# View PR details
gh pr view
```

Review checklist:
- Code follows project conventions
- No unnecessary changes
- Commit message is clear
- No sensitive data exposed
- Tests pass (if applicable)

### PR Naming Conventions

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

## Common Commands

```bash
# Start dev server
pnpm run dev

# Build for production
pnpm run build

# Run linting
pnpm run lint

# Open Chrome to localhost
open -a "Google Chrome" http://localhost:3000

# Create PR
gh pr create --title "Title" --body "Description"

# Merge PR (after approval)
gh pr merge --squash

# View PR status
gh pr status
```

## Code Practices

### Components
- Use functional components with TypeScript
- Keep components focused and single-purpose
- Use `'use client'` directive for client components

### API Routes
- Place in `app/api/` directory
- Use streaming responses for chat
- Load configurations from `agents/` directory

### Styling
- Use Tailwind CSS classes
- Follow existing design patterns
- Keep UI clean and minimal

### Agent Configuration
- System prompts go in `agents/SystemPrompt.md`
- Plugin configurations in respective plugin directories
- Use markdown files for agent/skill definitions

## File Naming

- Components: PascalCase (`ChatInterface.tsx`)
- Utilities: camelCase (`markdown.ts`)
- Routes: lowercase with hyphens (`api/chat/route.ts`)
- Content: lowercase with hyphens (`example-note.md`)

## Testing Changes

1. Run the dev server: `pnpm run dev`
2. Open browser: `open -a "Google Chrome" http://localhost:3000`
3. Test the chat functionality
4. Verify file explorer works
5. Check console for errors

## License

The plugins in `agents/` are under proprietary commercial license. See individual LICENSE files in each plugin directory.

