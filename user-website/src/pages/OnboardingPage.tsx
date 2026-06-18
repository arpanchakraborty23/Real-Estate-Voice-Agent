import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/components/AuthProvider'
import { savePreferences } from '@/lib/profileStore'
import type { UserPreferences } from '@/types'
import { Bed, Bath, MapPin, DollarSign, ChevronRight, ChevronLeft, Check, Home } from 'lucide-react'

const propertyTypeOptions = ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Land', 'Commercial']
const locationOptions = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL', 'Austin, TX', 'Seattle, WA']
const amenityOptions = ['Pool', 'Garage', 'Garden', 'Gym', 'Fireplace', 'Central AC', 'Hardwood Floors', 'Laundry', 'Balcony', 'Storage']

const steps = [
  { id: 'types', label: 'Property Types' },
  { id: 'budget', label: 'Budget' },
  { id: 'details', label: 'Details' },
  { id: 'locations', label: 'Locations' },
  { id: 'amenities', label: 'Amenities' },
]

export function OnboardingPage() {
  const { isSignedIn, isLoaded } = useAuthContext()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [prefs, setPrefs] = useState<UserPreferences>({
    propertyTypes: [],
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: 0,
    bathrooms: 0,
    locations: [],
    amenities: [],
    notifications: { email: true, sms: false, push: true, newListings: true, priceDrops: false, openHouses: true },
  })

  if (!isLoaded) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-terracotta border-t-transparent" />
      </div>
    )
  }

  if (!isSignedIn) {
    navigate('/login?redirect=/onboarding', { replace: true })
    return null
  }

  function toggleArray(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
  }

  function handleFinish() {
    savePreferences(prefs)
    navigate('/profile', { replace: true })
  }

  const isLast = step === steps.length - 1
  const canProceed = (() => {
    switch (steps[step].id) {
      case 'types': return prefs.propertyTypes.length > 0
      case 'budget': return prefs.maxPrice > 0
      case 'details': return true
      case 'locations': return prefs.locations.length > 0
      case 'amenities': return true
      default: return true
    }
  })()

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-6 py-12">
      <div className="w-full">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-terracotta/10">
            <Home className="size-7 text-terracotta" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">Tell Us What You're Looking For</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Set your preferences so we can recommend the perfect properties for you.
          </p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  i < step
                    ? 'bg-terracotta text-white'
                    : i === step
                      ? 'border-2 border-terracotta bg-terracotta/10 text-terracotta'
                      : 'border border-border bg-ivory-light text-ink-dim'
                }`}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </div>
              <span className={`hidden text-xs font-medium sm:block ${i === step ? 'text-terracotta' : 'text-ink-dim'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`mx-1 h-px w-6 ${i < step ? 'bg-terracotta' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-warm">
          {step === 0 && (
            <div>
              <h2 className="mb-1 font-display text-lg font-semibold text-ink">What type of property?</h2>
              <p className="mb-5 text-sm text-ink-muted">Select all that interest you.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {propertyTypeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => setPrefs({ ...prefs, propertyTypes: toggleArray(prefs.propertyTypes, type) })}
                    className={`rounded-xl border p-4 text-center text-sm font-medium transition-all ${
                      prefs.propertyTypes.includes(type)
                        ? 'border-terracotta bg-terracotta text-white shadow-sm'
                        : 'border-border bg-ivory-light text-ink-muted hover:border-terracotta hover:text-terracotta'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="mb-1 font-display text-lg font-semibold text-ink">What's your budget?</h2>
              <p className="mb-5 text-sm text-ink-muted">Set your price range.</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Min Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="number"
                      value={prefs.minPrice || ''}
                      onChange={(e) => setPrefs({ ...prefs, minPrice: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full rounded-xl border border-border bg-ivory-light py-3 pr-3 pl-9 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Max Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="number"
                      value={prefs.maxPrice === 10000000 ? '' : prefs.maxPrice}
                      onChange={(e) => setPrefs({ ...prefs, maxPrice: Number(e.target.value) })}
                      placeholder="10,000,000"
                      className="w-full rounded-xl border border-border bg-ivory-light py-3 pr-3 pl-9 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-1 font-display text-lg font-semibold text-ink">Minimum size?</h2>
              <p className="mb-5 text-sm text-ink-muted">Select the minimum bedrooms and bathrooms.</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Bedrooms</label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                    <select
                      value={prefs.bedrooms}
                      onChange={(e) => setPrefs({ ...prefs, bedrooms: Number(e.target.value) })}
                      className="w-full appearance-none rounded-xl border border-border bg-ivory-light py-3 pr-8 pl-9 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                    >
                      <option value={0}>Any</option>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n}+</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Bathrooms</label>
                  <div className="relative">
                    <Bath className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                    <select
                      value={prefs.bathrooms}
                      onChange={(e) => setPrefs({ ...prefs, bathrooms: Number(e.target.value) })}
                      className="w-full appearance-none rounded-xl border border-border bg-ivory-light py-3 pr-8 pl-9 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                    >
                      <option value={0}>Any</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}+</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-1 font-display text-lg font-semibold text-ink">Preferred locations?</h2>
              <p className="mb-5 text-sm text-ink-muted">Select the areas you're interested in.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {locationOptions.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setPrefs({ ...prefs, locations: toggleArray(prefs.locations, loc) })}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                      prefs.locations.includes(loc)
                        ? 'border-terracotta bg-terracotta text-white shadow-sm'
                        : 'border-border bg-ivory-light text-ink-muted hover:border-terracotta hover:text-terracotta'
                    }`}
                  >
                    <MapPin className="size-4 shrink-0" />
                    <span className="truncate">{loc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="mb-1 font-display text-lg font-semibold text-ink">Must-have amenities?</h2>
              <p className="mb-5 text-sm text-ink-muted">Select the features you care about.</p>
              <div className="flex flex-wrap gap-3">
                {amenityOptions.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => setPrefs({ ...prefs, amenities: toggleArray(prefs.amenities, amenity) })}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      prefs.amenities.includes(amenity)
                        ? 'border-terracotta bg-terracotta text-white shadow-sm'
                        : 'border-border bg-ivory-light text-ink-muted hover:border-terracotta hover:text-terracotta'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-terracotta-dim hover:text-ink disabled:opacity-0"
          >
            <ChevronLeft className="size-4" />
            Back
          </button>

          <button
            onClick={() => handleFinish()}
            className="rounded-xl bg-ivory-light px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-terracotta-dim hover:text-ink"
          >
            Skip
          </button>

          <button
            onClick={() => isLast ? handleFinish() : setStep(step + 1)}
            disabled={!canProceed}
            className="flex items-center gap-1.5 rounded-xl bg-terracotta px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-terracotta-hover disabled:opacity-40"
          >
            {isLast ? 'Get Started' : 'Next'}
            {!isLast && <ChevronRight className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
