# AI Finance Copilot - Documentation Hub

Welcome to the AI Finance Copilot documentation. This guide will help you understand, maintain, and extend the application.

## 📚 Documentation Structure

### Getting Started
- **[Overview](getting-started/overview.md)** - Project overview, tech stack, and current state
- **[Quickstart](getting-started/quickstart.md)** - Get up and running in 5 minutes

### Architecture
- **[System Design](architecture/system-design.md)** - High-level architecture and design decisions
- **[Data Flow](architecture/data-flow.md)** - How data moves through the application
- **[Patterns](architecture/patterns.md)** - Reusable UI and code patterns

### Features
- **[Dashboard](features/dashboard.md)** - Dashboard overview and metrics
- **[Accounts](features/accounts.md)** - Account management system
- **[Transactions](features/transactions.md)** - Transaction tracking
- **[Balance Tracking](features/balance-tracking.md)** - Historical balance snapshots
- **[AI Chat](features/ai-chat.md)** - AI assistant integration
- **[Search](features/search.md)** - Global search functionality

### API Reference
- **[Server Actions](api/server-actions.md)** - Complete server actions catalog
- **[Hooks](api/hooks.md)** - Custom React hooks reference
- **[Utilities](api/utilities.md)** - Helper functions and utilities

### Guides
- **[Testing](guides/testing.md)** - Testing strategy and examples
- **[Deployment](guides/deployment.md)** - Deployment guide

---

## 🚀 Quick Links

### For New Developers
1. Start with [Overview](getting-started/overview.md) to understand the project
2. Read [System Design](architecture/system-design.md) for architecture
3. Follow [Quickstart](getting-started/quickstart.md) to run locally
4. Check [Testing](guides/testing.md) before making changes

### For AI Assistants
- **Main reference:** `/CLAUDE.md` (root level)
- **Architecture:** [System Design](architecture/system-design.md)
- **Patterns:** [Patterns](architecture/patterns.md)
- **Features:** All files in `features/` directory

### Common Tasks
- **Understanding a feature?** → Check `features/` directory
- **Adding a new server action?** → Reference [Server Actions](api/server-actions.md)
- **Creating a component?** → See [Patterns](architecture/patterns.md)
- **Debugging data flow?** → Read [Data Flow](architecture/data-flow.md)

---

## 📊 Project Stats

- **Status:** Production-ready application
- **Files:** 207+ TypeScript files
- **Features:** 8 major feature areas
- **Models:** 8 Prisma models
- **Server Actions:** 20+ actions
- **Components:** 93+ components (including 80+ shadcn/ui)
- **Tests:** Unit tests (Vitest) + E2E tests (Playwright)

---

## 🛠️ Tech Stack

### Core
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19 + shadcn/ui + Tailwind CSS v4
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Supabase
- **State:** React Query (TanStack Query)
- **AI:** Anthropic Claude 3.5 Sonnet

### Testing
- **Unit/Integration:** Vitest + Testing Library
- **E2E:** Playwright

---

## 📖 Documentation Conventions

### File Naming
- Use kebab-case for all markdown files
- Keep filenames short and descriptive
- Example: `system-design.md`, not `SystemDesign.md` or `system_design.md`

### Structure
Each documentation file should have:
1. **Title** - Clear, descriptive H1
2. **Overview** - 1-2 paragraph summary
3. **Content** - Organized with H2/H3 sections
4. **Examples** - Code examples where applicable
5. **Related Links** - Links to related docs

### Code Examples
- Always include file paths in code examples
- Use TypeScript syntax highlighting
- Show both good and bad examples where helpful
- Keep examples concise but complete

---

## 🔄 Keeping Docs Updated

When you make significant code changes:

1. **Update relevant feature doc** - If you change how a feature works
2. **Update CLAUDE.md** - If you add new patterns or conventions
3. **Update architecture docs** - If you change system design
4. **Add examples** - If you create new patterns

---

## 🤝 Contributing to Docs

### Priorities
1. **Accuracy** > Comprehensiveness
2. **Examples** > Explanations
3. **Clear structure** > Beautiful prose

### Before Committing
- [ ] Run spell check
- [ ] Verify all internal links work
- [ ] Test any code examples
- [ ] Update table of contents if needed

---

## 📞 Need Help?

- **Code questions:** See [CLAUDE.md](/CLAUDE.md) at project root
- **Setup issues:** Check [Quickstart](getting-started/quickstart.md)
- **Architecture questions:** Read [System Design](architecture/system-design.md)
- **Feature-specific:** Check relevant file in `features/`

---

**Last Updated:** 2025-11-25
