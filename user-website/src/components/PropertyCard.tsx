import type { PropertyRecommendation } from '@/types'
import { BedDouble, MapPin } from 'lucide-react'

export function PropertyCard({ property }: { property: PropertyRecommendation }) {
  return (
    <div className="flex min-w-56 shrink-0 flex-col rounded-xl bg-card shadow-warm transition-all hover:shadow-warm-lg">
      <div className="h-32 overflow-hidden rounded-t-xl bg-border">
        {property.image_url ? (
          <img src={property.image_url} alt={property.title} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-ink-dim text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-display text-sm font-semibold text-ink truncate">{property.title}</h4>
        <p className="flex items-center gap-1 text-xs text-ink-muted">
          <MapPin className="size-3" />
          {property.location}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-terracotta">${property.price.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-xs text-ink-muted">
            <BedDouble className="size-3" />
            {property.bedrooms}
          </span>
        </div>
      </div>
    </div>
  )
}
