import type { DemoUser } from '../types/models';

/**
 * Initial demo customer fixture.
 * Per client requirements:
 * Initial balance must display $87.00 (8,700 USD cents).
 */
export const INITIAL_DEMO_CUSTOMER: DemoUser = {
  id: 'usr_demo_customer_01',
  username: 'user77007',
  displayName: 'user77007',
  email: 'user77007@demo.smm-panel.local',
  role: 'customer',
  balanceCents: 8700, // $87.00 exactly
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
};

export const INITIAL_DEMO_ADMIN: DemoUser = {
  id: 'usr_demo_admin_01',
  username: 'admin',
  displayName: 'Operations Lead',
  email: 'admin@demo.smm-panel.local',
  role: 'admin',
  balanceCents: 250000, // $2,500.00
  avatarUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
};

export const DEMO_CREDENTIALS = {
  customer: {
    username: 'user77007',
    password: 'password123',
  },
  admin: {
    username: 'admin',
    password: 'adminpassword',
  },
};
