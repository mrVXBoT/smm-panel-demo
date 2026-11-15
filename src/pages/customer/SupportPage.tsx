import { useState, type FormEvent } from 'react';
import { useAppStore } from '../../app/store';
import { AccountShell, AccountPanel } from '../../features/account/AccountShell';
import { AccountGlyph } from '../../features/account/AccountGlyph';
import { useSupportThreads } from '../../features/account/hooks';
import { accountService } from '../../features/account/accountService';
export function SupportPage() {
  const user = useAppStore((state) => state.currentUser);
  const { tickets, isLoading, error: loadError } = useSupportThreads(user.id);
  const [compose, setCompose] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const selected = tickets.find((ticket) => ticket.id === selectedId);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const openConversation = () => {
    setCompose(true);
    setSelectedId('');
    setError('');
  };
  const submit = async (event: FormEvent, isReply: boolean) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    try {
      if (isReply && selected) {
        await accountService.reply(user.id, selected.id, reply);
        setReply('');
      } else {
        const ticket = await accountService.createTicket(user.id, subject, message);
        setSelectedId(ticket.id);
        setCompose(false);
        setSubject('');
        setMessage('');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the thread. Try again.');
    } finally {
      setPending(false);
    }
  };
  return (
    <AccountShell kind="support">
      <div className="account-columns">
        <div className="account-stack">
          <AccountPanel kind="support" title="Start with a little clarity">
            <div className="account-help-guides">
              {[
                {
                  question: 'Where is my order?',
                  answer: 'Open Orders to see the saved status and review your order details.',
                },
                {
                  question: 'How do wallet funds work?',
                  answer:
                    'Credits and order charges are recorded together in your wallet activity.',
                },
                {
                  question: 'Do I need to share access?',
                  answer: 'No. Never include passwords, OTPs or private tokens in a conversation.',
                },
              ].map((guide) => (
                <details key={guide.question}>
                  <summary>
                    {guide.question}
                    <span>+</span>
                  </summary>
                  <p>{guide.answer}</p>
                </details>
              ))}
            </div>
          </AccountPanel>
          <AccountPanel kind="support" title="Your conversations" className="support-inbox-panel">
            {tickets.length > 0 && (
              <button
                className="account-primary-button support-new-ticket"
                onClick={openConversation}
              >
                <span aria-hidden="true">+</span> Open New Ticket
              </button>
            )}
            {isLoading ? (
              <p role="status">Loading threads…</p>
            ) : loadError ? (
              <p role="alert">{loadError}</p>
            ) : !tickets.length ? (
              <div className="support-inbox-empty">
                <div className="support-inbox-art" aria-hidden="true">
                  <div className="support-inbox-bubble support-inbox-bubble-back">
                    <i />
                    <i />
                  </div>
                  <div className="support-inbox-bubble support-inbox-bubble-front">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="support-inbox-spark">+</span>
                </div>
                <div className="support-inbox-copy">
                  <span className="support-inbox-eyebrow">LET’S TALK</span>
                  <h3>A fresh conversation starts here.</h3>
                  <p>
                    Questions about an order or your wallet? Keep every detail together in one
                    thread.
                  </p>
                  <button className="account-primary-button" onClick={openConversation}>
                    <span aria-hidden="true">+</span> Open New Ticket
                  </button>
                </div>
              </div>
            ) : (
              tickets.map((ticket) => (
                <button
                  className="account-ticket-row"
                  key={ticket.id}
                  onClick={() => {
                    setSelectedId(ticket.id);
                    setCompose(false);
                    setError('');
                  }}
                  aria-pressed={selectedId === ticket.id}
                >
                  <span>
                    <strong>{ticket.subject}</strong>
                    <small>
                      {ticket.messages.length} messages ·{' '}
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </small>
                  </span>
                  <b>{ticket.status.replaceAll('_', ' ')}</b>
                </button>
              ))
            )}
            <p className="support-inbox-note">
              Saved on this device · No message is sent to a support agent.
            </p>
          </AccountPanel>
        </div>
        <AccountPanel
          kind="support"
          title={
            compose ? 'A new conversation' : selected ? 'Thread details' : 'We’re here to guide you'
          }
        >
          {error && (
            <p role="alert" className="account-error">
              {error}
            </p>
          )}
          {compose ? (
            <form className="account-form" onSubmit={(event) => void submit(event, false)}>
              <label>
                Subject
                <input
                  required
                  autoFocus
                  minLength={4}
                  maxLength={100}
                  value={subject}
                  disabled={pending}
                  onChange={(event) => setSubject(event.target.value)}
                />
              </label>
              <label>
                Message
                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={6}
                  value={message}
                  disabled={pending}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </label>
              <p className="account-fineprint">
                Do not include credentials or personal information.
              </p>
              <button className="account-primary-button" disabled={pending}>
                {pending ? 'Saving…' : 'Save ticket'}
              </button>
              <button
                type="button"
                className="account-text-link"
                disabled={pending}
                onClick={() => setCompose(false)}
              >
                Cancel
              </button>
            </form>
          ) : selected ? (
            <div className="account-thread">
              <h3>{selected.subject}</h3>
              <span className="account-eyebrow">CONVERSATION</span>
              {selected.messages.map((item) => (
                <article key={item.id}>
                  <span>You · {new Date(item.createdAt).toLocaleString()}</span>
                  <p>{item.content}</p>
                </article>
              ))}
              <form className="account-form" onSubmit={(event) => void submit(event, true)}>
                <label>
                  Add a reply
                  <textarea
                    rows={3}
                    minLength={2}
                    maxLength={2000}
                    required
                    value={reply}
                    disabled={pending}
                    onChange={(event) => setReply(event.target.value)}
                  />
                </label>
                <button className="account-primary-button" disabled={pending}>
                  {pending ? 'Saving…' : 'Save reply'}
                </button>
              </form>
            </div>
          ) : (
            <div className="account-empty">
              <AccountGlyph kind="support" />
              <h3>Let’s find your next step.</h3>
              <p>Open a conversation or explore the guides. Nova will keep the details together.</p>
            </div>
          )}
        </AccountPanel>
      </div>
    </AccountShell>
  );
}
