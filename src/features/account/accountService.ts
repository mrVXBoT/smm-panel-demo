import { db } from '../../core/db/database';
import type { DemoUser, Ticket } from '../../core/types/models';
export interface AccountService {
  updateName(userId: string, displayName: string): Promise<DemoUser>;
  createTicket(userId: string, subject: string, message: string): Promise<Ticket>;
  reply(userId: string, ticketId: string, message: string): Promise<void>;
}
function text(value: string, min: number, max: number, label: string) {
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max)
    throw new Error(`${label} must be ${min}–${max} characters.`);
  return trimmed;
}
/** All account writes are local mock operations behind this typed adapter. */
export const accountService: AccountService = {
  async updateName(userId, displayName) {
    const name = text(displayName, 2, 40, 'Display name');
    return db.transaction('rw', db.users, async () => {
      const user = await db.users.get(userId);
      if (!user) throw new Error('Demo account not found.');
      const updated = { ...user, displayName: name };
      await db.users.put(updated);
      return updated;
    });
  },
  async createTicket(userId, subject, message) {
    const title = text(subject, 4, 100, 'Subject'),
      content = text(message, 10, 2000, 'Message');
    if (!(await db.users.get(userId))) throw new Error('Demo account not found.');
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: `TCK-${crypto.randomUUID()}`,
      userId,
      subject: title,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: crypto.randomUUID(),
          senderId: userId,
          senderRole: 'customer',
          content,
          createdAt: now,
        },
      ],
    };
    await db.tickets.add(ticket);
    return ticket;
  },
  async reply(userId, ticketId, message) {
    const content = text(message, 2, 2000, 'Reply');
    await db.transaction('rw', db.tickets, async () => {
      const ticket = await db.tickets.get(ticketId);
      if (!ticket || ticket.userId !== userId) throw new Error('Thread not found.');
      const now = new Date().toISOString();
      await db.tickets.put({
        ...ticket,
        status: 'open',
        updatedAt: now,
        messages: [
          ...ticket.messages,
          {
            id: crypto.randomUUID(),
            senderId: userId,
            senderRole: 'customer',
            content,
            createdAt: now,
          },
        ],
      });
    });
  },
};
