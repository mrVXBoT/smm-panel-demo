import { beforeEach, describe, expect, it } from 'vitest';
import { accountService } from './accountService';
import { resetDemoSystem } from '../../core/db/reset';
import { db } from '../../core/db/database';
import { INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN } from '../../core/fixtures/demoUser';
const userId = INITIAL_DEMO_CUSTOMER.id;
beforeEach(async () => {
  await resetDemoSystem();
});
describe('local account service', () => {
  it('persists a demo name without changing identity or role', async () => {
    const updated = await accountService.updateName(userId, 'Nova Tester');
    expect(updated.displayName).toBe('Nova Tester');
    expect(updated.role).toBe('customer');
    expect((await db.users.get(userId))?.username).toBe(INITIAL_DEMO_CUSTOMER.username);
  });
  it('creates and replies to a persisted local support thread', async () => {
    const thread = await accountService.createTicket(
      userId,
      'Demo order question',
      'This is a fictional test question.',
    );
    await accountService.reply(userId, thread.id, 'A second test message.');
    const stored = await db.tickets.get(thread.id);
    expect(stored?.messages).toHaveLength(2);
    expect(stored?.status).toBe('open');
  });
  it('rejects invalid messages and cross-user replies', async () => {
    await expect(accountService.createTicket(userId, 'x', 'short')).rejects.toThrow();
    const thread = await accountService.createTicket(
      userId,
      'Test question',
      'A fictional support message.',
    );
    await expect(
      accountService.reply(INITIAL_DEMO_ADMIN.id, thread.id, 'Not my thread'),
    ).rejects.toThrow('not found');
    expect((await db.tickets.get(thread.id))?.messages).toHaveLength(1);
  });
  it('clears tickets and restores names with demo reset', async () => {
    await accountService.createTicket(userId, 'Demo reset test', 'A fictional message for reset.');
    await accountService.updateName(userId, 'Changed Name');
    await resetDemoSystem();
    expect(await db.tickets.count()).toBe(0);
    expect((await db.users.get(userId))?.displayName).toBe(INITIAL_DEMO_CUSTOMER.displayName);
  });
});
