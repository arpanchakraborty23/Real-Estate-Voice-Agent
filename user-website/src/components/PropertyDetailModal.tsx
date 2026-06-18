import { useState, useEffect, type FormEvent } from 'react'
import type { Property } from '@/types'
import { submitInquiry } from '@/api/client'
import { toggleLike, isLiked } from '@/lib/profileStore'
import { Heart } from 'lucide-react'

export function PropertyDetailModal({
  property,
  onClose,
}: {
  property: Property
  onClose: () => void
}) {
  const allImages = property.images?.length ? property.images : [property.image_url]
  const [liked, setLiked] = useState(() => isLiked(property.id))
  const [activeImg, setActiveImg] = useState(0)
  const [tab, setTab] = useState<'details' | 'builder' | 'contact'>('details')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await submitInquiry({ ...form, propertyId: property.id })
      setSent(true)
    } catch {
      setError('Failed to send. Please try again or call us directly.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="relative w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-2xl">
          <svg className="mx-auto mb-4 size-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 className="mb-1 font-display text-lg font-bold text-ink">Inquiry Sent!</h3>
          <p className="mb-6 text-sm text-ink-muted">
            Thanks for your interest in <strong>{property.title}</strong>. The builder will reach out shortly.
          </p>
          <button
            onClick={onClose}
            className="rounded-lg bg-terracotta px-6 py-2.5 text-sm font-medium text-white cursor-pointer hover:bg-terracotta-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const builder = property.builder

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* ── Gallery ── */}
        <div className="relative bg-black/5">
          <div className="h-64 sm:h-80">
            <img
              src={allImages[activeImg]}
              alt={`${property.title} — photo ${activeImg + 1}`}
              className="size-full object-cover transition-opacity"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          <span className="absolute bottom-4 left-4 rounded-full bg-terracotta px-4 py-1.5 text-sm font-medium text-white capitalize">
            {property.type}
          </span>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1.5">
              {allImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`size-10 cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                    i === activeImg ? 'border-white shadow-md' : 'border-white/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Tab bar ── */}
        <div className="flex border-b border-border/50">
          {(['details', 'builder', 'contact'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 cursor-pointer py-3 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {t === 'details' ? 'Details' : t === 'builder' ? 'Builder' : 'Contact'}
            </button>
          ))}
        </div>

        {/* ── Tab: Details ── */}
        {tab === 'details' && (
          <div className="p-6 sm:p-8">
            <div className="mb-1 flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-ink">{property.title}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { toggleLike(property.id); setLiked(!liked) }}
                  className={`flex size-9 items-center justify-center rounded-lg border transition-all ${
                    liked
                      ? 'border-terracotta bg-terracotta text-white'
                      : 'border-border text-ink-muted hover:border-terracotta hover:text-terracotta'
                  }`}
                >
                  <Heart className={`size-4 ${liked ? 'fill-current' : ''}`} />
                </button>
                <span className="shrink-0 rounded-full bg-terracotta/10 px-3 py-1 text-xs font-mono text-terracotta">
                  {property.id}
                </span>
              </div>
            </div>

            <p className="mb-5 flex items-center gap-1.5 text-sm text-ink-muted">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {property.location}
            </p>

            <p className="mb-6 text-3xl font-bold text-terracotta">
              ${property.price.toLocaleString()}
            </p>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-4 gap-3 rounded-xl bg-ink/5 p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-ink">{property.bedrooms}</p>
                <p className="text-[11px] text-ink-muted">Beds</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-ink">{property.bathrooms}</p>
                <p className="text-[11px] text-ink-muted">Baths</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-ink">{property.area.toLocaleString()}</p>
                <p className="text-[11px] text-ink-muted">Sq Ft</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-ink">{property.yearBuilt || '—'}</p>
                <p className="text-[11px] text-ink-muted">Year</p>
              </div>
            </div>

            {/* Lot + extra */}
            {property.lotSize && property.lotSize !== '—' && (
              <div className="mb-5 flex items-center gap-2 text-sm text-ink-muted">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 22V8l7-5 7 5v14" />
                  <path d="M2 22h20" />
                  <path d="M9 22v-6h6v6" />
                </svg>
                Lot: {property.lotSize}
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 font-display text-base font-semibold text-ink">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-ink-muted"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <h3 className="mb-2 font-display text-base font-semibold text-ink">About This Property</h3>
            <p className="text-sm leading-relaxed text-ink-muted">{property.description}</p>
          </div>
        )}

        {/* ── Tab: Builder ── */}
        {tab === 'builder' && builder && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-xl font-bold text-terracotta">
                {builder.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{builder.name}</h3>
                <div className="mt-1 flex items-center gap-4 text-xs text-ink-muted">
                  <span>{builder.yearsExperience} years experience</span>
                  <span className="size-1 rounded-full bg-ink-dim" />
                  <span>{builder.projectsCompleted} projects</span>
                </div>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-ink-muted">{builder.bio}</p>

            <div className="space-y-3 rounded-xl bg-ink/5 p-4">
              <div className="flex items-center gap-3 text-sm">
                <svg className="size-4 shrink-0 text-ink-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="text-ink-muted">{builder.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="size-4 shrink-0 text-ink-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href={`mailto:${builder.email}`} className="text-terracotta hover:underline">{builder.email}</a>
              </div>
            </div>
          </div>
        )}

        {tab === 'builder' && !builder && (
          <div className="p-6 sm:p-8 text-center text-ink-muted text-sm">
            Builder information is not available for this property.
          </div>
        )}

        {/* ── Tab: Contact ── */}
        {tab === 'contact' && (
          <div className="p-6 sm:p-8">
            <h3 className="mb-1 font-display text-lg font-bold text-ink">Interested in this property?</h3>
            <p className="mb-6 text-sm text-ink-muted">
              Fill out the form below and the builder will get back to you about <strong>{property.title}</strong>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-muted">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-muted">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                  placeholder={`I'm interested in ${property.title} (${property.id}). Please send me more details.`}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="w-full cursor-pointer rounded-lg bg-terracotta px-6 py-3 text-sm font-medium text-white transition-all hover:bg-terracotta-hover disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Inquiry'}
              </button>

              {builder && (
                <p className="text-center text-xs text-ink-dim">
                  Or call {builder.name} directly at <span className="font-medium text-ink-muted">{builder.phone}</span>
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
