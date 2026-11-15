import { useState, type FormEvent } from 'react';
import { useAppStore } from '../../app/store';
import { resetDemoSystem } from '../../core/db/reset';
import { AccountShell, AccountPanel } from '../../features/account/AccountShell';
import { AccountGlyph } from '../../features/account/AccountGlyph';
import { accountService } from '../../features/account/accountService';
export function ProfilePage() {
  const { currentUser, setCurrentUser, theme, setTheme, sidebarCollapsed, toggleSidebarCollapsed } =
    useAppStore();
  const [name, setName] = useState(currentUser.displayName);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError('');
    setSuccess('');
    try {
      const updated = await accountService.updateName(currentUser.id, name);
      setCurrentUser(updated);
      setSuccess('Profile updated.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save this profile.');
    } finally {
      setPending(false);
    }
  };
  const reset = async () => {
    setPending(true);
    setError('');
    setSuccess('');
    try {
      await resetDemoSystem();
      setName(useAppStore.getState().currentUser.displayName);
      setConfirmReset(false);
      setSuccess('Original sample data restored.');
    } catch {
      setError('Could not restore the sample data. Try again.');
    } finally {
      setPending(false);
    }
  };
  return (
    <AccountShell kind="profile">
      <div className="account-columns">
        <div className="account-stack">
          <section className="profile-pass">
            <div>
              <span>NOVA / IDENTITY</span>
              <AccountGlyph kind="profile" />
            </div>
            <span className="profile-avatar">{currentUser.displayName.charAt(0)}</span>
            <h2>{currentUser.displayName}</h2>
            <p>@{currentUser.username}</p>
            <span className="profile-role">{currentUser.role}</span>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>{currentUser.email}</dd>
              </div>
              <div>
                <dt>Account ID</dt>
                <dd>{currentUser.id}</dd>
              </div>
            </dl>
          </section>
          <AccountPanel kind="profile" title="Your workspace, your way">
            <div className="account-preference-row">
              <div>
                <strong>Appearance</strong>
                <p>A comfortable view in every light.</p>
              </div>
              <div className="account-segments">
                {(['dark', 'light'] as const).map((value) => (
                  <button
                    key={value}
                    aria-pressed={theme === value}
                    onClick={() => setTheme(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="account-preference-row">
              <div>
                <strong>Compact navigation</strong>
                <p>Keep more room for your content.</p>
              </div>
              <button
                role="switch"
                aria-checked={sidebarCollapsed}
                aria-label="Compact navigation"
                className="account-switch"
                onClick={toggleSidebarCollapsed}
              >
                <span />
              </button>
            </div>
          </AccountPanel>
        </div>
        <div className="account-stack">
          <AccountPanel kind="profile" title="The details that feel like you">
            <form className="account-form" onSubmit={(event) => void save(event)}>
              <label>
                Display name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  maxLength={40}
                  required
                  disabled={pending}
                />
              </label>
              <p className="account-fineprint">Choose a display name for this workspace.</p>
              {error && (
                <p role="alert" className="account-error">
                  {error}
                </p>
              )}
              {success && (
                <p role="status" className="account-positive">
                  {success}
                </p>
              )}
              <button className="account-primary-button" disabled={pending}>
                {pending ? 'Saving…' : 'Save profile'}
              </button>
            </form>
          </AccountPanel>
          <AccountPanel kind="profile" title="Workspace controls">
            <p className="account-fineprint">
              Restore the original sample data in this browser’s workspace.
            </p>
            {confirmReset ? (
              <div className="account-reset-confirm">
                <p>
                  Restore sample data? This clears local orders, top-ups and support threads, then
                  reloads the original samples.
                </p>
                <button
                  className="account-danger-button"
                  disabled={pending}
                  onClick={() => void reset()}
                >
                  Restore sample data now
                </button>
                <button
                  className="account-text-link"
                  disabled={pending}
                  onClick={() => setConfirmReset(false)}
                >
                  Keep my data
                </button>
              </div>
            ) : (
              <button
                className="account-text-link account-danger"
                onClick={() => setConfirmReset(true)}
              >
                Restore sample data
              </button>
            )}
          </AccountPanel>
        </div>
      </div>
    </AccountShell>
  );
}
