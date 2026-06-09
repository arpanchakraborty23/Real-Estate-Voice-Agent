import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
const links = [
  { to: '/', label: 'Home', icon: 'icon-home-alt' },
  { to: '/voice-agent', label: 'Voice Agent', icon: 'icon-mic' },
  { to: '/properties', label: 'Properties', icon: 'icon-building' },
  { to: '/about', label: 'About', icon: 'icon-users' },
  { to: '/contact', label: 'Contact', icon: 'icon-phone' },
]

export function NavBar() {
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-ivory-light/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="New House" className="h-8" />
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === to
                  ? 'bg-terracotta-dim text-terracotta'
                  : 'text-ink-muted hover:bg-terracotta-dim/50 hover:text-ink',
              )}
            >
              <svg className="size-4" aria-hidden="true">
                <use href={`/brand-icons.svg#${icon}`} />
              </svg>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
