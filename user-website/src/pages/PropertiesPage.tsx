import { useEffect, useState } from 'react'
import { fetchProperties } from '@/api/client'
import type { Property, PropertyFilters } from '@/types'

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condo' },
]

const fallbackImages = [
  '/images/beautiful-house.jpg',
  '/images/luxury-house.jpg',
  '/images/pool-house.jpg',
  '/images/rural-house.jpg',
  '/images/modern-kitchen.jpg',
  '/images/modern-bedroom.jpg',
]

export function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<PropertyFilters>({})

  useEffect(() => {
    setLoading(true)
    fetchProperties(filters)
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink">Properties</h1>
      <p className="mb-8 text-ink-muted">Browse our curated selection of properties.</p>

      <div className="mb-8 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-dim" aria-hidden="true">
            <use href="/brand-icons.svg#icon-search" />
          </svg>
          <input
            placeholder="Search location or name..."
            value={filters.location ?? ''}
            onChange={(e) => setFilters({ ...filters, location: e.target.value || undefined })}
            className="w-full rounded-lg border border-border bg-card py-2.5 pr-4 pl-9 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          />
        </div>

        <select
          value={filters.type ?? ''}
          onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
          className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
        >
          {propertyTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <select
          value={filters.bedrooms ?? ''}
          onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value ? Number(e.target.value) : undefined })}
          className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
        >
          <option value="">Any Bedrooms</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}+ Beds</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min price"
            value={filters.priceMin ?? ''}
            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value ? Number(e.target.value) : undefined })}
            className="w-28 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          />
          <span className="text-ink-dim">-</span>
          <input
            type="number"
            placeholder="Max price"
            value={filters.priceMax ?? ''}
            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value ? Number(e.target.value) : undefined })}
            className="w-28 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-card p-4 shadow-warm">
              <div className="mb-3 h-48 rounded-lg bg-border" />
              <div className="mb-2 h-5 w-3/4 rounded bg-border" />
              <div className="mb-1 h-4 w-1/2 rounded bg-border" />
              <div className="h-4 w-1/3 rounded bg-border" />
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="py-20 text-center">
          <svg className="mx-auto mb-4 size-12 text-ink-dim" aria-hidden="true">
            <use href="/brand-icons.svg#icon-search" />
          </svg>
          <h2 className="mb-2 font-display text-xl font-semibold text-ink">No properties found</h2>
          <p className="text-ink-muted">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p, i) => (
            <div key={p.id} className="group rounded-xl bg-card shadow-warm transition-all hover:shadow-warm-lg">
              <div className="relative h-48 overflow-hidden rounded-t-xl bg-border">
                <img
                  src={p.image_url ?? fallbackImages[i % fallbackImages.length]}
                  alt={p.title}
                  className="size-full object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-terracotta/90 px-3 py-1 text-xs font-medium text-white">
                  {p.type}
                </span>
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-display text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mb-3 flex items-center gap-1 text-sm text-ink-muted">
                  <svg className="size-3.5 shrink-0" aria-hidden="true">
                    <use href="/brand-icons.svg#icon-map-pin" />
                  </svg>
                  {p.location}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-terracotta">
                    ${p.price.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-ink-muted">
                    <svg className="size-3.5 shrink-0" aria-hidden="true">
                      <use href="/brand-icons.svg#icon-house" />
                    </svg>
                    {p.bedrooms} beds
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
