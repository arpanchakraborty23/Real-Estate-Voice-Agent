import { Link } from 'react-router-dom'

const featuredProperties = [
  {
    title: 'Modern Family Home',
    type: 'House',
    image: '/images/beautiful-house.jpg',
    description: '4-bedroom contemporary home with open-plan living and landscaped garden.',
    beds: 4,
    baths: 3,
    price: '$850,000',
  },
  {
    title: 'Luxury Cliffside Villa',
    type: 'Villa',
    image: '/images/luxury-house.jpg',
    description: 'Stunning villa perched on a cliff with panoramic ocean views.',
    beds: 5,
    baths: 4,
    price: '$2,400,000',
  },
  {
    title: 'Resort-Style Estate',
    type: 'Villa',
    image: '/images/pool-house.jpg',
    description: 'Private estate with infinity pool, outdoor kitchen, and lush tropical gardens.',
    beds: 6,
    baths: 5,
    price: '$3,100,000',
  },
  {
    title: 'Charming Country House',
    type: 'House',
    image: '/images/rural-house.jpg',
    description: 'Beautifully restored rural home with shingled roof and wraparound porch.',
    beds: 3,
    baths: 2,
    price: '$620,000',
  },
  {
    title: 'Modern Open Kitchen',
    type: 'Interior',
    image: '/images/modern-kitchen.jpg',
    description: 'Gourmet kitchen with marble islands, smart appliances, and natural light.',
    beds: '-',
    baths: '-',
    price: '',
  },
  {
    title: 'Serene Master Bedroom',
    type: 'Interior',
    image: '/images/modern-bedroom.jpg',
    description: 'Peaceful master suite with ensuite spa bathroom and walk-in wardrobe.',
    beds: '-',
    baths: 2,
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
      {/* ── Hero ── */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/hero-house.jpg"
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/80 to-ivory/30" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-terracotta/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-terracotta uppercase">
              AI-Powered Real Estate
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-ink md:text-6xl">
              Find Your
              <br />
              <span className="text-terracotta">Dream Home</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Tell Anjali, our AI voice agent, exactly what you're looking for.
              Browse homes, see images, and get personalized recommendations —
              all through a natural conversation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/voice-agent"
                className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-terracotta/25 transition-all hover:bg-terracotta-hover hover:shadow-xl hover:shadow-terracotta/30"
              >
                <svg className="size-4" aria-hidden="true"><use href="/brand-icons.svg#icon-mic" /></svg>
                Talk to Anjali
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/80 px-7 py-3.5 text-sm font-medium text-ink backdrop-blur-sm transition-colors hover:bg-card"
              >
                <svg className="size-4" aria-hidden="true"><use href="/brand-icons.svg#icon-building" /></svg>
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
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
            Start a conversation with Anjali right now. No forms, no waiting — just talk.
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
