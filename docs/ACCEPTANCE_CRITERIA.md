# Acceptance Criteria
1. New visitor can navigate landing, services, pricing, FAQ and enter demo customer mode.
2. Customer can filter services and submit a validated order with computed total.
3. Order is persisted on refresh, visible in customer and admin views, and follows allowed state transitions.
4. Wallet mock top-up offers Visa/Mastercard simulation without any real card fields; successful simulation credits once; failed simulation credits zero.
5. Admin can manage demo service availability and order status.
6. Virtual numbers, Stars and Premium have tailored UI with entirely fictional fulfillment.
7. User can reset demo data to a consistent seed state.
8. Mobile and desktop navigation, keyboard focus, empty/error/loading states work.
9. lint, typecheck, unit tests, build and smoke E2E succeed.
10. Demo disclosure is visible in all transactional contexts.
