# Data Models (conceptual)
Service: id, categoryId, name, description, pricePerThousandCents?, fixedPriceCents?, minQty?, maxQty?, status, estimatedDeliveryLabel.
Order: id, userId, serviceId, target, quantity, chargeCents, status, createdAt, updatedAt.
PaymentAttempt: id, userId, amountCents, method (visa_demo|mastercard_demo), state, idempotencyKey, createdAt.
LedgerEntry: id, walletId, orderId?, paymentId?, amountCents (signed), kind, createdAt.
Wallet: id, userId, currency. Balance is derived from ledger.
Ticket: id, userId, subject, status, messages[].
DemoUser: id, displayName, role (customer|admin).
All phone identifiers are fictional placeholders. No OTP, PAN, CVV or actual payment credentials.
