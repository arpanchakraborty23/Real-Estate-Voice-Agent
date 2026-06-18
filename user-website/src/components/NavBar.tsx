import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/components/AuthProvider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { User, LogOut, Heart, Settings } from 'lucide-react'
import { useClerk } from '@clerk/clerk-react'

const links = [
  { to: '/', label: 'Home', icon: 'icon-home-alt' },
  { to: '/voice-agent', label: 'Consulting', icon: 'icon-mic' },
  { to: '/properties', label: 'Properties', icon: 'icon-building' },
  { to: '/about', label: 'About', icon: 'icon-users' },
  { to: '/contact', label: 'Contact', icon: 'icon-phone' },
]

const menuItems = [
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/profile?tab=saved', label: 'Saved Properties', icon: Heart },
  { to: '/profile?tab=preferences', label: 'Preferences', icon: Settings },
]

export function NavBar() {
  const { pathname } = useLocation()
  const { isSignedIn, isLoaded, user } = useAuthContext()
  const { signOut } = useClerk()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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

          {isLoaded && (
            <div className="ml-2 border-l border-border pl-2" ref={menuRef}>
              {isSignedIn && user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-terracotta-dim"
                  >
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt="" className="size-7 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-full bg-terracotta-dim text-xs font-semibold text-terracotta">
                        {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="hidden text-sm font-medium text-ink sm:block">
                      {user.firstName || 'Profile'}
                    </span>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 origin-top-right animate-scale-in rounded-xl border border-border bg-card p-1.5 shadow-warm-lg">
                      {menuItems.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-terracotta-dim hover:text-ink"
                        >
                          <Icon className="size-4" />
                          {label}
                        </Link>
                      ))}
                      <div className="my-1 border-t border-border" />
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <LogOut className="size-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <User className="size-3.5" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}