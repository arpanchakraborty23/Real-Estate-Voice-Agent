import { Link } from 'react-router-dom'

const team = [
  { name: 'Anjali Sharma', role: 'AI Voice Agent', photo: '/images/team-office.jpg' },
  { name: 'Rajesh Kumar', role: 'Senior Realtor', photo: null },
  { name: 'Priya Patel', role: 'Property Consultant', photo: null },
  { name: 'Amit Singh', role: 'Market Analyst', photo: null },
]

const teamPhotos = ['/images/team-professional.jpg', '/images/team-office.jpg', '/images/luxury-interior.jpg', '/images/city-skyline.jpg']

const stats = [
  { value: '15+', label: 'Years in Business', icon: 'icon-star' },
  { value: '2,500+', label: 'Properties Sold', icon: 'icon-heart' },
  { value: '12', label: 'Cities Covered', icon: 'icon-map-pin' },
  { value: '5,000+', label: 'Happy Clients', icon: 'icon-users' },
]

export function AboutPage() {
  return (
    <div>
      <section className="relative bg-ivory py-20 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
          <img src="/about-hero.svg" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="mb-4 text-4xl font-bold text-ink md:text-5xl">
            New House Real Estate
          </h1>
          <p className="text-lg text-ink-muted">
            Your Dream Home Awaits
          </p>
        </div>
      </section>

      <section className="relative bg-card py-16">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-10">
          <img src="/images/team-professional.jpg" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 text-center font-display text-2xl font-semibold text-ink">Our Story</h2>
          <div className="space-y-4 text-ink-muted leading-relaxed">
            <p>
              Founded in 2010, New House Real Estate has grown from a small family business
              into one of the region's most trusted property consultancies. Our journey began
              with a simple belief: finding a home should be a joyful experience, not a stressful one.
            </p>
            <p>
              Today, we combine cutting-edge AI technology with genuine human expertise to help
              you discover properties that match your lifestyle, budget, and dreams. Our AI voice
              agent, Anjali, is available 24/7 to answer your questions and guide you through
              the process.
            </p>
            <p>
              We're not just selling properties — we're helping people find where their next
              chapter begins.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center font-display text-2xl font-semibold text-ink">Our Team</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {team.map((member, i) => (
              <div key={member.name} className="rounded-xl bg-card p-6 text-center shadow-warm">
                <div className="mx-auto mb-3 size-20 overflow-hidden rounded-full border-2 border-terracotta-dim">
                  {teamPhotos[i] ? (
                    <img src={teamPhotos[i]} alt={member.name} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-terracotta-dim">
                      <svg className="size-7 text-terracotta" aria-hidden="true">
                        <use href="/brand-icons.svg#icon-users" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-base font-semibold text-ink">{member.name}</h3>
                <p className="text-sm text-ink-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-terracotta py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <svg className="mx-auto mb-2 size-8 opacity-80" aria-hidden="true">
                  <use href={`/brand-icons.svg#${stat.icon}`} />
                </svg>
                <div className="font-display text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-20 text-center">
        <div className="relative mx-auto max-w-xl px-6">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl opacity-15">
            <img src="/images/luxury-house.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
            Talk to Anjali
          </h2>
          <p className="mb-6 text-ink-muted">
            Our AI voice agent is ready to help you find your perfect home.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta-hover"
          >
            Start Talking
            <svg className="size-4" aria-hidden="true">
              <use href="/brand-icons.svg#icon-arrow-right" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
