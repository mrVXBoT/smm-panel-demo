# SMM Panel Demo

Private, frontend-only interactive SMM storefront and management dashboard prototype. **All orders, phone numbers, Stars, Premium, balances and Visa/Mastercard payments are simulations.** No real fulfillment or payment details are collected.

## Planned stack
React 19 · TypeScript · Vite · Tailwind CSS 4 · shadcn/ui · React Router · Zustand · React Hook Form + Zod · TanStack Table · Recharts · Dexie · MSW · Vitest · Playwright.

## Documentation
- [Product requirements](docs/PRODUCT_REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Roadmap](docs/ROADMAP.md)
- [Data models](docs/DATA_MODELS.md)
- [Acceptance criteria](docs/ACCEPTANCE_CRITERIA.md)
- [Agent rules](AGENTS.md)
- [Contributing](CONTRIBUTING.md)

## Status
Planning and repository governance initialized. Application implementation begins with P00 Foundation. The CI workflow is a target contract and will not pass until the Vite application and package scripts are committed.

## Principles
Explicit DEMO disclosure, no actual Visa/Mastercard collection, no real OTP/virtual numbers, no external SMM fulfillment. Feature-first architecture with typed mock services and persistent seed/reset behavior.
