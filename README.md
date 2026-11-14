# SMM Panel Demo

Private, frontend-only interactive SMM storefront and management dashboard prototype. **All orders, phone numbers, Stars, Premium, balances and Visa/Mastercard payments are simulations.** No real fulfillment or payment details are collected.

## Implemented Stack (Phase P00)
- **Framework & Runtime:** React 19, TypeScript strict mode, Vite
- **Styling & Design System:** Tailwind CSS 4, shadcn/ui-compatible tokens
- **Routing:** React Router v7
- **State Management:** Zustand
- **Form & Validation:** React Hook Form, Zod
- **Icons & Motion:** Lucide React, Motion
- **Testing & Quality:** Vitest, Testing Library, ESLint 9, Prettier

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Quality Gates & Tests
```bash
npm run lint       # ESLint check
npm run typecheck  # TypeScript strict compiler check
npm run test       # Vitest unit & component test suite
npm run build      # Production bundle build
```

## Demo Credentials & Initial State
- **Customer Demo Persona:**
  - Username: `demouser`
  - Password: `password123`
  - Initial Balance: **$87.00** (8,700 USD cents)
- **Admin Demo Persona:**
  - Username: `admin`
  - Password: `adminpassword`

## Documentation
- [Product requirements](docs/PRODUCT_REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Roadmap](docs/ROADMAP.md)
- [Data models](docs/DATA_MODELS.md)
- [Acceptance criteria](docs/ACCEPTANCE_CRITERIA.md)
- [Agent rules](AGENTS.md)
- [Contributing](CONTRIBUTING.md)

## Principles
Explicit DEMO disclosure, no actual Visa/Mastercard collection, no real OTP/virtual numbers, no external SMM fulfillment. Feature-first architecture with typed mock services and persistent seed/reset behavior.
