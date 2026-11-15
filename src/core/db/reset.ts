import { resetDatabaseToSeed } from './seed';
import { useAppStore } from '../../app/store';

/**
 * Unified Demo System Reset:
 * 1. Resets Dexie database back to the clean initial fixtures:
 *    - Customer balance: exactly $87.00 (8,700 cents derived from ledger).
 *    - Initial orders and catalog fixtures reseeded.
 * 2. Resets Zustand UI state and session:
 *    - Session persona set to default customer (user77007).
 *    - Authenticated state set to true.
 *    - Sidebar/transient dialogs closed.
 */
export async function resetDemoSystem(): Promise<void> {
  await resetDatabaseToSeed();
  useAppStore.getState().resetDemoSession();
}
