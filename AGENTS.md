# Agent Rules
## Mission
Build a polished, responsive, frontend-only SMM Panel **simulation**. No real fulfillment, phone numbers, OTPs, or payments.
## Stack
React 19, TypeScript strict, Vite, Tailwind CSS 4, shadcn/ui, React Router, Zustand, React Hook Form, Zod, TanStack Table, Recharts, Dexie, MSW, Vitest, Playwright.
## Architecture
Feature-first modules. UI components never mutate persistence directly. All side effects go through typed service interfaces, with mock adapters. Domain models are independent of React and storage.
## Safety
Prominent DEMO label in app and checkout. Never collect or persist PAN, CVV, expiry, OTP, passwords, or genuine virtual phone numbers. Visa/Mastercard are simulated method selectors only. Use fictional/test-only identifiers. No real provider API calls or fulfillment.
## Workflow
One issue per change; branch feature/<issue>-<slug>. Small focused commits; PR review before merge. No secrets committed. Strict typing; avoid any. Accessibility and responsive layouts mandatory.
## Quality gates
npm run lint, npm run typecheck, npm run test, npm run build. Include tests for pricing, order transitions, wallet ledger and reset. No feature is done without loading/error/empty states and acceptance criteria.
## UX
Dark and light themes, consistent design tokens, keyboard navigation, meaningful labels, skeletons and toasts. Support i18n and RTL-ready layouts.
