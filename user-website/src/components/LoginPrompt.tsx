import { useEffect, useState } from 'react'
import { useAuthContext } from '@/components/AuthProvider'
import { Button } from '@/components/ui/button'
import { X, HeartHandshake, Sparkles, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const perks = [
  { icon: HeartHandshake, text: 'Save properties you love' },
  { icon: Sparkles, text: 'Get personalized recommendations' },
  { icon: Building2, text: 'Connect with top builders' },
]

export function LoginPrompt() {
  const { isSignedIn, isLoaded } = useAuthContext()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!isLoaded || isSignedIn || dismissed) return

    const timer = setTimeout(() => {
      setShow(true)
    }, 30_000)

    return () => clearTimeout(timer)
  }, [isLoaded, isSignedIn, dismissed])

  if (!show || isSignedIn) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-warm-lg">
        <button
          onClick={() => { setShow(false); setDismissed(true) }}
          className="absolute right-4 top-4 rounded-full p-1 text-ink-muted hover:bg-terracotta-dim hover:text-terracotta transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="mb-6 text-center">
          <img src="/logo.svg" alt="New House" className="mx-auto mb-4 h-9" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Save Your Dream Home
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Create an account to save properties, set preferences, and get personalized recommendations.
          </p>
        </div>

        <div className="mb-6 space-y-2.5">
          {perks.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 rounded-lg bg-ivory-light p-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-terracotta-dim">
                <Icon className="size-4 text-terracotta" />
              </div>
              <span className="text-sm text-ink-muted">{text}</span>
            </div>
          ))}
        </div>

        <Link
          to="/login"
          onClick={() => setShow(false)}
          className="flex w-full items-center justify-center rounded-lg bg-terracotta px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-hover"
        >
          Sign Up Free
        </Link>

        <p className="mt-3 text-center text-xs text-ink-dim">
          Already have an account?{' '}
          <Link to="/login" onClick={() => setShow(false)} className="text-terracotta hover:underline font-medium">
            Sign in
          </Link>
        </p>

        <div className="mt-3 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setShow(false); setDismissed(true) }}
            className="text-ink-dim text-xs"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  )
}