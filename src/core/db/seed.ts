import { db } from './database';
import { INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN } from '../fixtures/demoUser';
import { INITIAL_SERVICES } from '../fixtures/services';
import { INITIAL_ORDERS, INITIAL_LEDGER } from '../fixtures/initialOrders';

export async function seedDatabase(): Promise<void> {
  const userCount = await db.users.count();
  if (userCount === 0) {
    await db.transaction(
      'rw',
      [db.users, db.wallets, db.services, db.orders, db.ledgerEntries, db.tickets],
      async () => {
        await db.users.bulkAdd([{ ...INITIAL_DEMO_CUSTOMER }, { ...INITIAL_DEMO_ADMIN }]);

        await db.wallets.bulkAdd([
          {
            id: `wal_${INITIAL_DEMO_CUSTOMER.id}`,
            userId: INITIAL_DEMO_CUSTOMER.id,
            currency: 'USD',
            balanceCents: 8700,
          },
          {
            id: `wal_${INITIAL_DEMO_ADMIN.id}`,
            userId: INITIAL_DEMO_ADMIN.id,
            currency: 'USD',
            balanceCents: 250000,
          },
        ]);

        await db.services.bulkAdd([...INITIAL_SERVICES]);
        await db.orders.bulkAdd([...INITIAL_ORDERS]);
        await db.ledgerEntries.bulkAdd([...INITIAL_LEDGER]);
      },
    );
  }
}

export async function resetDatabaseToSeed(): Promise<void> {
  await db.transaction(
    'rw',
    [db.users, db.wallets, db.services, db.orders, db.ledgerEntries, db.tickets],
    async () => {
      await db.tickets.clear();
      await db.users.clear();
      await db.wallets.clear();
      await db.services.clear();
      await db.orders.clear();
      await db.ledgerEntries.clear();

      await db.users.bulkAdd([{ ...INITIAL_DEMO_CUSTOMER }, { ...INITIAL_DEMO_ADMIN }]);

      await db.wallets.bulkAdd([
        {
          id: `wal_${INITIAL_DEMO_CUSTOMER.id}`,
          userId: INITIAL_DEMO_CUSTOMER.id,
          currency: 'USD',
          balanceCents: 8700,
        },
        {
          id: `wal_${INITIAL_DEMO_ADMIN.id}`,
          userId: INITIAL_DEMO_ADMIN.id,
          currency: 'USD',
          balanceCents: 250000,
        },
      ]);

      await db.services.bulkAdd([...INITIAL_SERVICES]);
      await db.orders.bulkAdd([...INITIAL_ORDERS]);
      await db.ledgerEntries.bulkAdd([...INITIAL_LEDGER]);
    },
  );
}

export const resetDatabase = resetDatabaseToSeed;
