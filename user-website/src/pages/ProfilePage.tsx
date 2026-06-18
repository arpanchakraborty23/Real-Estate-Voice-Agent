import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAuthContext } from '@/components/AuthProvider'
import { useSearchParams, Navigate } from 'react-router-dom'
import {
  Heart,
  Search,
  Bell,
  Settings,
  SlidersHorizontal,
  Shield,
  User,
  MapPin,
  Home,
  DollarSign,
  Bed,
  Bath,
  Trash2,
  HeartOff,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  getPreferences,
  savePreferences,
  getSavedSearches,
  addSavedSearch,
  removeSavedSearch,
  getLikedProperties,
  toggleLike,
} from '@/lib/profileStore'
import type { UserPreferences } from '@/types'

const propertyTypeOptions = ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Land', 'Commercial']
const locationOptions = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL', 'Austin, TX', 'Seattle, WA']
const amenityOptions = ['Pool', 'Garage', 'Garden', 'Gym', 'Fireplace', 'Central AC', 'Hardwood Floors', 'Laundry', 'Balcony', 'Storage']

const tabs = [
  { id: 'info', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { id: 'saved', label: 'Saved Properties', icon: Heart },
  { id: 'searches', label: 'Saved Searches', icon: Search },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

export function ProfilePage() {
  const { isSignedIn, isLoaded } = useAuthContext()
  const { user } = useUser()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'info')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tabs.some((t) => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-terracotta border-t-transparent" />
      </div>
    )
  }

  if (!isSignedIn || !user) {
    return <Navigate to="/login?redirect=/profile" replace />
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">My Profile</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage your account, preferences, and saved items.</p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 shadow-warm mb-8">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === id
                ? 'bg-terracotta text-white shadow-sm'
                : 'text-ink-muted hover:bg-terracotta-dim hover:text-ink'
            }`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-warm">
        {activeTab === 'info' && <ProfileInfoTab user={user} />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
        {activeTab === 'saved' && <SavedPropertiesTab />}
        {activeTab === 'searches' && <SavedSearchesTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  )
}

function ProfileInfoTab({ user }: { user: NonNullable<ReturnType<typeof useUser>['user']> }) {
  const email = user.primaryEmailAddress?.emailAddress || ''
  const phone = user.primaryPhoneNumber?.phoneNumber || ''

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt="" className="size-20 rounded-full border-2 border-border object-cover" />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-terracotta-dim text-2xl font-semibold text-terracotta">
              {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">
            {user.fullName || 'User'}
          </h2>
          <p className="text-sm text-ink-muted">{email}</p>
          <p className="text-sm text-ink-muted">{phone || 'No phone added'}</p>
          <p className="mt-1 text-xs text-ink-dim">
            Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">First Name</label>
          <input
            type="text"
            defaultValue={user.firstName || ''}
            className="w-full rounded-lg border border-border bg-ivory-light px-3 py-2 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Last Name</label>
          <input
            type="text"
            defaultValue={user.lastName || ''}
            className="w-full rounded-lg border border-border bg-ivory-light px-3 py-2 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Email</label>
          <input
            type="email"
            defaultValue={email}
            className="w-full rounded-lg border border-border bg-ivory-light/50 px-3 py-2 text-sm text-ink-dim outline-none cursor-not-allowed"
            disabled
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Phone</label>
          <input
            type="tel"
            defaultValue={phone}
            placeholder="Add phone number"
            className="w-full rounded-lg border border-border bg-ivory-light px-3 py-2 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" className="bg-terracotta text-white hover:bg-terracotta-hover">Save Changes</Button>
      </div>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">Password</h3>
        <p className="text-sm text-ink-muted">Manage your sign-in credentials.</p>
      </div>

      <div className="rounded-lg border border-border bg-ivory-light p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Password</p>
            <p className="text-xs text-ink-muted">Last changed 3 months ago</p>
          </div>
          <Button variant="outline" size="sm">Change Password</Button>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-ink">Connected Accounts</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border bg-ivory-light p-4">
            <div className="flex items-center gap-3">
              <svg className="size-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <div>
                <p className="text-sm font-medium text-ink">Google</p>
                <p className="text-xs text-ink-muted">Connected</p>
              </div>
            </div>
            <Button variant="ghost" size="xs" className="text-terracotta">Disconnect</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreferencesTab() {
  const prefs = getPreferences()
  const [local, setLocal] = useState<UserPreferences>(prefs)
  const [saved, setSaved] = useState(false)

  function toggleArray(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
  }

  function handleSave() {
    savePreferences(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">Property Preferences</h3>
        <p className="text-sm text-ink-muted">Tell us what you're looking for so we can suggest the perfect properties.</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">Property Types</label>
        <div className="flex flex-wrap gap-2">
          {propertyTypeOptions.map((type) => (
            <button
              key={type}
              onClick={() => setLocal({ ...local, propertyTypes: toggleArray(local.propertyTypes, type) })}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                local.propertyTypes.includes(type)
                  ? 'border-terracotta bg-terracotta text-white'
                  : 'border-border bg-ivory-light text-ink-muted hover:border-terracotta hover:text-terracotta'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Min Price</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="number"
              value={local.minPrice}
              onChange={(e) => setLocal({ ...local, minPrice: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-ivory-light py-2 pr-3 pl-8 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Max Price</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="number"
              value={local.maxPrice}
              onChange={(e) => setLocal({ ...local, maxPrice: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-ivory-light py-2 pr-3 pl-8 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Bedrooms</label>
          <div className="relative">
            <Bed className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <select
              value={local.bedrooms}
              onChange={(e) => setLocal({ ...local, bedrooms: Number(e.target.value) })}
              className="w-full appearance-none rounded-lg border border-border bg-ivory-light py-2 pr-8 pl-8 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
            >
              <option value={0}>Any</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}+</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Bathrooms</label>
          <div className="relative">
            <Bath className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <select
              value={local.bathrooms}
              onChange={(e) => setLocal({ ...local, bathrooms: Number(e.target.value) })}
              className="w-full appearance-none rounded-lg border border-border bg-ivory-light py-2 pr-8 pl-8 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
            >
              <option value={0}>Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}+</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">Preferred Locations</label>
        <div className="flex flex-wrap gap-2">
          {locationOptions.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocal({ ...local, locations: toggleArray(local.locations, loc) })}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                local.locations.includes(loc)
                  ? 'border-terracotta bg-terracotta text-white'
                  : 'border-border bg-ivory-light text-ink-muted hover:border-terracotta hover:text-terracotta'
              }`}
            >
              <MapPin className="size-3.5" />
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => (
            <button
              key={amenity}
              onClick={() => setLocal({ ...local, amenities: toggleArray(local.amenities, amenity) })}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                local.amenities.includes(amenity)
                  ? 'border-terracotta bg-terracotta text-white'
                  : 'border-border bg-ivory-light text-ink-muted hover:border-terracotta hover:text-terracotta'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button
          onClick={handleSave}
          className="bg-terracotta text-white hover:bg-terracotta-hover"
        >
          {saved ? 'Preferences Saved!' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  )
}

function SavedPropertiesTab() {
  const liked = getLikedProperties()

  if (liked.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <Heart className="mb-4 size-12 text-ink-dim" />
        <h3 className="font-display text-lg font-semibold text-ink">No saved properties yet</h3>
        <p className="mt-1 text-sm text-ink-muted">Browse properties and tap the heart icon to save your favorites.</p>
        <Button className="mt-4 bg-terracotta text-white hover:bg-terracotta-hover" asChild>
          <a href="/properties">Browse Properties</a>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">Saved Properties ({liked.length})</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {liked.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border bg-ivory-light shadow-sm transition-shadow hover:shadow-warm">
            <div className="aspect-[4/3] overflow-hidden bg-ivory-dark">
              <img
                src={item.property.image_url}
                alt={item.property.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h4 className="font-display text-base font-semibold text-ink">{item.property.title}</h4>
              <p className="flex items-center gap-1 text-xs text-ink-muted">
                <MapPin className="size-3" />
                {item.property.location}
              </p>
              <p className="mt-1 text-sm font-semibold text-terracotta">
                ${item.property.price.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-ink-muted">
                <span>{item.property.bedrooms} bed</span>
                <span>{item.property.bathrooms} bath</span>
                <span>{item.property.area} sqft</span>
              </div>
            </div>
            <button
              onClick={() => { toggleLike(item.propertyId); window.location.reload() }}
              className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/80 text-terracotta shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            >
              <HeartOff className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SavedSearchesTab() {
  const searches = getSavedSearches()

  if (searches.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <Search className="mb-4 size-12 text-ink-dim" />
        <h3 className="font-display text-lg font-semibold text-ink">No saved searches yet</h3>
        <p className="mt-1 text-sm text-ink-muted">Search for properties and save your filters for quick access.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4 font-display text-lg font-semibold text-ink">Saved Searches ({searches.length})</h3>
      <div className="space-y-3">
        {searches.map((search) => (
          <div key={search.id} className="flex items-center justify-between rounded-lg border border-border bg-ivory-light p-4">
            <div>
              <p className="text-sm font-medium text-ink">{search.name}</p>
              <p className="text-xs text-ink-muted">
                {search.filters.type && `${search.filters.type} · `}
                {search.filters.location && `${search.filters.location} · `}
                {search.filters.bedrooms && `${search.filters.bedrooms} bed · `}
                {search.filters.priceMin && `$${search.filters.priceMin.toLocaleString()}-`}
                {search.filters.priceMax && `$${search.filters.priceMax.toLocaleString()}`}
              </p>
              <p className="mt-0.5 text-xs text-ink-dim">
                Saved {new Date(search.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" className="text-terracotta">
                <ExternalLink className="size-4" />
              </Button>
              <button
                onClick={() => { removeSavedSearch(search.id); window.location.reload() }}
                className="rounded-lg p-1.5 text-ink-muted hover:bg-danger/10 hover:text-danger transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationsTab() {
  const prefs = getPreferences()
  const [notif, setNotif] = useState(prefs.notifications)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    savePreferences({ notifications: notif })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">Notification Preferences</h3>
        <p className="text-sm text-ink-muted">Choose how and when we notify you.</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-ink">Channels</h4>
        <div className="space-y-3">
          {[
            { key: 'email' as const, label: 'Email', desc: 'Receive notifications via email' },
            { key: 'sms' as const, label: 'SMS', desc: 'Receive text message alerts' },
            { key: 'push' as const, label: 'Push', desc: 'Receive push notifications in browser' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center justify-between rounded-lg border border-border bg-ivory-light p-4">
              <div>
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-xs text-ink-muted">{desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notif[key]}
                onChange={() => setNotif({ ...notif, [key]: !notif[key] })}
                className="size-4 accent-terracotta"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-ink">Alerts</h4>
        <div className="space-y-3">
          {[
            { key: 'newListings' as const, label: 'New Listings', desc: 'Get notified when new properties match your preferences' },
            { key: 'priceDrops' as const, label: 'Price Drops', desc: 'Get notified when saved properties drop in price' },
            { key: 'openHouses' as const, label: 'Open Houses', desc: 'Get notified about open house events in your area' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center justify-between rounded-lg border border-border bg-ivory-light p-4">
              <div>
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-xs text-ink-muted">{desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notif[key]}
                onChange={() => setNotif({ ...notif, [key]: !notif[key] })}
                className="size-4 accent-terracotta"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button
          onClick={handleSave}
          className="bg-terracotta text-white hover:bg-terracotta-hover"
        >
          {saved ? 'Saved!' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  )
}