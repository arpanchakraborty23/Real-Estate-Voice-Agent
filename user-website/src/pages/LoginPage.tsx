import { useState, useMemo } from 'react'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { useAuthContext } from '@/components/AuthProvider'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Building2, HeartHandshake, Sparkles, Shield } from 'lucide-react'

const perks = [
  { icon: HeartHandshake, text: 'Save your favorite properties' },
  { icon: Sparkles, text: 'Get personalized recommendations' },
  { icon: Building2, text: 'Track price changes and new listings' },
  { icon: Shield, text: 'Connect directly with top builders' },
]

function useClerkAppearance() {
  return useMemo(() => ({
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none p-0 bg-transparent',
      headerTitle: 'font-display text-ink text-xl',
      headerSubtitle: 'text-ink-muted text-sm',
      socialButtonsBlockButton:
        'border-border text-ink hover:bg-terracotta-dim hover:border-terracotta bg-ivory-light rounded-lg h-10 text-sm font-medium transition-colors',
      socialButtonsBlockButtonText: 'text-ink',
      dividerLine: 'bg-border',
      dividerText: 'text-ink-muted text-xs',
      formFieldLabel: 'text-ink-muted text-sm font-medium',
      formFieldInput:
        'rounded-lg border-border bg-ivory-light text-ink placeholder:text-ink-dim px-3 py-2.5 text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-shadow',
      formButtonPrimary:
        'bg-terracotta hover:bg-terracotta-hover text-white rounded-lg h-10 text-sm font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]',
      formButtonSecondary:
        'border-border text-ink hover:bg-terracotta-dim rounded-lg h-10 text-sm font-medium transition-colors',
      footerAction: 'hidden',
      footerActionLink: 'hidden',
    },
  }), [])
}

export function LoginPage() {
  const { isSignedIn, isLoaded } = useAuthContext()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-up')
  const [searchParams] = useSearchParams()
  const appearance = useClerkAppearance()

  if (!isLoaded) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-terracotta border-t-transparent" />
      </div>
    )
  }

  if (isSignedIn) {
    return <Navigate to={searchParams.get('redirect') || '/profile'} replace />
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-ink via-ink to-terracotta/80 p-12 lg:flex">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gold blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-terracotta blur-3xl" />
        </div>

        <div className="relative">
          <img src="/logo.svg" alt="New House" className="h-8 brightness-0 invert" />
        </div>

        <div className="relative space-y-6">
          <h1 className="font-display text-4xl font-bold leading-tight text-white">
            Find Your<br />
            <span className="text-gold">Dream Home</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-ivory/80">
            Join thousands of homebuyers who trust New House to find their perfect property.
            Save listings, track prices, and connect with builders.
          </p>
          <div className="space-y-3 pt-4">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-white/10">
                  <Icon className="size-4 text-gold" />
                </div>
                <span className="text-sm text-ivory/80">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-ivory/40">
          &copy; {new Date().getFullYear()} New House Real Estate
        </div>
      </div>

      {/* Auth form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">
              {mode === 'sign-up' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {mode === 'sign-up'
                ? 'Sign up to save properties and get recommendations.'
                : 'Sign in to access your saved properties and preferences.'}
            </p>
          </div>

          {mode === 'sign-up' ? (
            <SignUp
              key="sign-up"
              appearance={appearance}
              afterSignUpUrl={searchParams.get('redirect') || '/onboarding'}
            />
          ) : (
            <SignIn
              key="sign-in"
              appearance={appearance}
              afterSignInUrl={searchParams.get('redirect') || '/profile'}
            />
          )}

          <p className="mt-6 text-center text-sm text-ink-muted">
            {mode === 'sign-up' ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('sign-in')}
                  className="font-medium text-terracotta hover:underline transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('sign-up')}
                  className="font-medium text-terracotta hover:underline transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
