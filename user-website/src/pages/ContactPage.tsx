import { useState } from 'react'
import { submitInquiry } from '@/api/client'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await submitInquiry(form)
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto mb-4 size-12 text-success" aria-hidden="true">
            <use href="/brand-icons.svg#icon-check" />
          </svg>
          <h1 className="mb-2 font-display text-2xl font-semibold text-ink">Thank You!</h1>
          <p className="text-ink-muted">We'll get back to you shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto max-w-4xl px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.07]">
        <img src="/images/hero-house.jpg" alt="" className="h-full w-full object-cover" />
      </div>
      <h1 className="mb-8 text-center font-display text-3xl font-bold text-ink">Get in Touch</h1>

      <div className="grid gap-8 md:grid-cols-5">
        <div className="hidden flex-col gap-6 md:col-span-2 md:flex">
          <div className="flex items-center justify-center">
            <img src="/contact-illustration.svg" alt="" className="h-56 w-56" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 size-5 shrink-0 text-terracotta" aria-hidden="true">
                <use href="/brand-icons.svg#icon-phone" />
              </svg>
              <div>
                <h3 className="font-display text-sm font-semibold text-ink">Phone</h3>
                <p className="text-sm text-ink-muted">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 size-5 shrink-0 text-terracotta" aria-hidden="true">
                <use href="/brand-icons.svg#icon-mail" />
              </svg>
              <div>
                <h3 className="font-display text-sm font-semibold text-ink">Email</h3>
                <p className="text-sm text-ink-muted">hello@newhouse.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 size-5 shrink-0 text-terracotta" aria-hidden="true">
                <use href="/brand-icons.svg#icon-map-pin" />
              </svg>
              <div>
                <h3 className="font-display text-sm font-semibold text-ink">Office</h3>
                <p className="text-sm text-ink-muted">123 Dream Street, Cityville, ST 12345</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:col-span-3">
          <input
            required
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          />
          <input
            required
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          />
          <input
            required
            type="tel"
            placeholder="Your Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          />
          <textarea
            required
            rows={4}
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 resize-none"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta-hover"
          >
            <svg className="size-4" aria-hidden="true">
              <use href="/brand-icons.svg#icon-mail" />
            </svg>
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
