import { Link } from 'react-router-dom'

const featuredProperties = [
  {
    title: 'Modern Family Home',
    type: 'House',
    image: '/images/beautiful-house.jpg',
    description: '4-bedroom contemporary home with open-plan living and landscaped garden.',
    beds: 4, baths: 3,
    price: '$850,000',
  },
  {
    title: 'Luxury Cliffside Villa',
    type: 'Villa',
    image: '/images/luxury-house.jpg',
    description: 'Stunning villa perched on a cliff with panoramic ocean views.',
    beds: 5, baths: 4,
    price: '$2,400,000',
  },
  {
    title: 'Resort-Style Estate',
    type: 'Villa',
    image: '/images/pool-house.jpg',
    description: 'Private estate with infinity pool, outdoor kitchen, and lush tropical gardens.',
    beds: 6, baths: 5,
    price: '$3,100,000',
  },
  {
    title: 'Charming Country House',
    type: 'House',
    image: '/images/rural-house.jpg',
    description: 'Beautifully restored rural home with shingled roof and wraparound porch.',
    beds: 3, baths: 2,
    price: '$620,000',
  },
  {
    title: 'Modern Open Kitchen',
    type: 'Interior',
    image: '/images/modern-kitchen.jpg',
    description: 'Gourmet kitchen with marble islands, smart appliances, and natural light.',
    beds: '-' as const, baths: '-' as const,
    price: '',
  },
  {
    title: 'Serene Master Bedroom',
    type: 'Interior',
    image: '/images/modern-bedroom.jpg',
    description: 'Peaceful master suite with ensuite spa bathroom and walk-in wardrobe.',
    beds: '-' as const, baths: 2,
    price: '',
  },
]

const features = [
  {
    icon: 'icon-search',
    title: 'AI-Powered Search',
    text: 'Just describe your dream home and our AI finds the perfect match instantly.',
  },
  {
    icon: 'icon-mic',
    title: 'Voice Agent Anjali',
    text: 'Talk naturally to Anjali — she understands every detail of what you\'re looking for.',
  },
  {
    icon: 'icon-image',
    title: 'Live Property Images',
    text: 'See properties in real time as Anjali shares photos during your conversation.',
  },
  {
    icon: 'icon-star',
    title: 'Smart Recommendations',
    text: 'Personalized property suggestions based on your preferences and budget.',
  },
]

export function LandingPage() {
  return (
    <div>
      {/* ════════════════════════════════════════
           HERO — Editorial Split
           Left: ivory content panel
           Right: full-height image with diagonal reveal
           ════════════════════════════════════════ */}
      <section className="relative grid min-h-screen overflow-hidden md:grid-cols-2">
        {/* ── left panel ── */}
        <div className="relative z-10 flex flex-col justify-center bg-ivory px-8 py-24 md:px-16 lg:px-24">
          <div className="max-w-lg">
            {/* badge */}
            <span
              className="inline-flex items-center gap-2 rounded-full border border-terracotta/20 bg-terracotta-dim px-4 py-1.5 text-xs font-medium tracking-widest text-terracotta uppercase animate-fade-slide-in"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              <span className="size-1.5 rounded-full bg-terracotta" />
              AI-Powered Real Estate
            </span>

            {/* headline */}
            <h1
              className="mt-8 font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl lg:text-8xl animate-fade-slide-in"
              style={{ animationDelay: '0.25s', animationFillMode: 'both' }}
            >
              Find Your
              <br />
              <span className="relative italic text-terracotta">
                Dream Home
                <svg
                  className="absolute -bottom-2 left-0 w-full text-terracotta/30"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 10 C 50 2, 100 2, 198 10" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>

            {/* body */}
            <p
              className="mt-6 max-w-md text-base leading-relaxed text-ink-muted md:text-lg animate-fade-slide-in"
              style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
              Tell Anjali, our AI voice agent, exactly what you&rsquo;re looking for.
              Browse homes, see images, and get personalized recommendations &mdash;
              all through a natural conversation.
            </p>

            {/* CTAs */}
            <div
              className="mt-10 flex flex-wrap gap-4 animate-fade-slide-in"
              style={{ animationDelay: '0.55s', animationFillMode: 'both' }}
            >
              <Link
                to="/voice-agent"
                className="group inline-flex items-center gap-2.5 rounded-lg bg-terracotta px-8 py-4 text-sm font-medium text-white shadow-lg shadow-terracotta/20 transition-all hover:bg-terracotta-hover hover:shadow-xl hover:shadow-terracotta/25"
              >
                <svg className="size-4 transition-transform group-hover:scale-110" aria-hidden="true">
                  <use href="/brand-icons.svg#icon-mic" />
                </svg>
                Talk to Anjali
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2.5 rounded-lg border border-border bg-card/60 px-8 py-4 text-sm font-medium text-ink backdrop-blur-sm transition-all hover:border-terracotta/30 hover:bg-card"
              >
                <svg className="size-4" aria-hidden="true">
                  <use href="/brand-icons.svg#icon-building" />
                </svg>
                Browse Properties
              </Link>
            </div>
          </div>

          {/* decorative rule */}
          <div
            className="mt-16 h-px w-24 bg-gradient-to-r from-terracotta/40 to-transparent animate-fade-in"
            style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
          />
        </div>

        {/* ── right panel ── */}
        <div className="relative overflow-hidden bg-ivory-dark">
          <div
            className="absolute inset-0 animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <img
              src="/images/hero-house.jpg"
              alt=""
              className="size-full object-cover"
            />
          </div>

          {/* gradient veil from left */}
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-ivory via-ivory/60 to-transparent" />

          {/* large watermark monogram */}
          <div
            className="pointer-events-none absolute bottom-8 right-8 select-none text-[12rem] font-bold leading-none text-white/5 md:text-[18rem] animate-fade-in"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            NH
          </div>

          {/* subtle diagonal accent line */}
          <svg
            className="pointer-events-none absolute right-0 top-0 h-full w-64 text-ivory/20"
            viewBox="0 0 100 100%"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="100" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="0.5" />
          </svg>

          {/* floating stat cards */}
          <div
            className="absolute bottom-8 left-8 right-8 z-10 grid grid-cols-3 gap-3 animate-fade-slide-in"
            style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
          >
            {[
              { value: '15+', label: 'Years' },
              { value: '2,500+', label: 'Sold' },
              { value: '98%', label: 'Satisfied' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/20 bg-white/70 px-4 py-3 text-center backdrop-blur-md"
              >
                <div className="font-display text-xl font-bold text-ink md:text-2xl">{s.value}</div>
                <div className="text-[11px] font-medium tracking-wider text-ink-muted uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* noise texture overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      </section>

      {/* ── Featured Properties ── */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-ink">Featured Properties</h2>
            <p className="mt-2 text-ink-muted">Handpicked homes to inspire you</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((p) => (
              <div
                key={p.title}
                className="group relative overflow-hidden rounded-xl bg-ivory shadow-warm transition-all hover:shadow-warm-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur-sm">
                    {p.type}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{p.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-ink-dim">
                    {p.beds !== '-' && (
                      <span className="flex items-center gap-1">
                        <svg className="size-3.5" aria-hidden="true"><use href="/brand-icons.svg#icon-house" /></svg>
                        {p.beds} Beds
                      </span>
                    )}
                    {p.baths !== '-' && (
                      <span className="flex items-center gap-1">
                        <svg className="size-3.5" aria-hidden="true"><use href="/brand-icons.svg#icon-home-alt" /></svg>
                        {p.baths} Baths
                      </span>
                    )}
                  </div>
                  {p.price && (
                    <p className="mt-3 font-display text-lg font-bold text-terracotta">{p.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 rounded-lg border border-terracotta px-6 py-3 text-sm font-medium text-terracotta transition-colors hover:bg-terracotta hover:text-white"
            >
              View All Properties
              <svg className="size-4" aria-hidden="true"><use href="/brand-icons.svg#icon-arrow-right" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-ink">Why New House?</h2>
            <p className="mt-2 text-ink-muted">Technology meets human expertise</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl bg-card p-6 text-center shadow-warm transition-all hover:shadow-warm-lg">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-terracotta-dim">
                  <svg className="size-6 text-terracotta" aria-hidden="true">
                    <use href={`/brand-icons.svg#${f.icon}`} />
                  </svg>
                </div>
                <h3 className="mb-2 font-display text-base font-semibold text-ink">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lifestyle Gallery ── */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-ink">A Home for Every Lifestyle</h2>
            <p className="mt-2 text-ink-muted">From urban apartments to countryside estates</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
            <div className="group relative overflow-hidden rounded-xl md:col-span-2 md:row-span-2">
              <img src="/images/luxury-house.jpg" alt="Luxury villa" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="font-display text-xl font-bold text-white">Villas</span>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl">
              <img src="/images/beautiful-house.jpg" alt="Modern house" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-display text-base font-bold text-white">Houses</span>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl">
              <img src="/images/pool-house.jpg" alt="Pool" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-display text-base font-bold text-white">Pools</span>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl">
              <img src="/images/modern-kitchen.jpg" alt="Interior" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-display text-base font-bold text-white">Interiors</span>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl">
              <img src="/images/rural-house.jpg" alt="Countryside" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-display text-base font-bold text-white">Countryside</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-terracotta py-20">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/city-skyline.jpg" alt="" className="size-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <svg className="mx-auto mb-4 size-10 text-white/60" aria-hidden="true">
            <use href="/brand-icons.svg#icon-mic" />
          </svg>
          <h2 className="font-display text-3xl font-bold text-white">
            Ready to Find Your Dream Home?
          </h2>
          <p className="mt-3 text-lg text-white/80">
            Start a conversation with Anjali right now. No forms, no waiting &mdash; just talk.
          </p>
          <Link
            to="/voice-agent"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-medium text-terracotta shadow-lg transition-all hover:bg-ivory-light hover:shadow-xl"
          >
            <svg className="size-4" aria-hidden="true"><use href="/brand-icons.svg#icon-mic" /></svg>
            Talk to Anjali
          </Link>
        </div>
      </section>
    </div>
  )
}
