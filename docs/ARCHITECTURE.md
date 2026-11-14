# Architecture
## Runtime
React + Vite SPA hosted as static assets. No required server.
## Layers
pages -> features -> typed domain services -> mock adapters -> Dexie IndexedDB. MSW intercepts example REST endpoints for realistic async network behavior. Zustand stores ephemeral UI state; durable domain state lives in Dexie.
## Domains
User, ServiceCategory, Service, Order, Wallet, LedgerEntry, PaymentAttempt, Ticket, Referral, AuditEvent.
## Rules
Money stored in integer minor units (USD cents). Ledger append-only; wallet balance derived/validated from ledger. Each order has a unique ID and explicit state machine. Mock payment has idempotency key; retries cannot credit twice. Admin/customer views share same repository.
## Routing
/, /services, /pricing, /login, /app, /app/order/new, /app/orders, /app/wallet, /app/transactions, /app/numbers, /app/stars, /app/premium, /app/support, /app/profile, /admin, /admin/services, /admin/orders, /admin/users, /admin/payments, /admin/tickets, /admin/settings.
## Testing
Vitest domain tests, React Testing Library UI tests, Playwright smoke flows. CI: lint, typecheck, tests, build.
## Future migration
Swap mock adapters for real APIs behind interfaces; do not reuse demo auth or demo checkout for production.
