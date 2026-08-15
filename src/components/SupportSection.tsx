import { useState, type FormEvent } from 'react'

const SUPPORT_EMAIL = 'support@bill-store.com'

export function SupportSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error')
      setErrorText('Please fill in your name, email, and message.')
      return
    }
    setStatus('sending')
    setErrorText('')
    try {
      const res = await fetch('/api/support.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Could not send your message.')
      }
      setStatus('ok')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setErrorText(err instanceof Error ? err.message : 'Could not send your message.')
    }
  }

  return (
    <section className="content-band support-section" id="support">
      <h2>Support</h2>
      <p>
        Need help with invoices or your Bill Store account? Email us at{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or send a message below — we’ll get
        back to you as soon as we can.
      </p>

      <div className="support-grid">
        <div className="support-card">
          <h3>Email support</h3>
          <p className="support-email">
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
          <p>For billing questions, bug reports, and feature requests.</p>
        </div>

        <form className="support-form" onSubmit={submit}>
          <h3>Send a message</h3>
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              rows={4}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'ok' ? (
            <p className="support-success">Thanks — your message was saved. We’ll reply soon.</p>
          ) : null}
          {status === 'error' ? <p className="support-error">{errorText}</p> : null}
        </form>
      </div>
    </section>
  )
}
