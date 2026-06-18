import { useState } from 'react'
import type { PropertyRecommendation } from '@/types'
import { BedDouble, MapPin, Heart } from 'lucide-react'
import { toggleLike, isLiked } from '@/lib/profileStore'

export function PropertyCard({ property }: { property: PropertyRecommendation }) {
  const [liked, setLiked] = useState(() => isLiked(property.id))

  return (
    <div className="flex min-w-56 shrink-0 flex-col rounded-xl bg-card shadow-warm transition-all hover:shadow-warm-lg">
      <div className="relative h-32 overflow-hidden rounded-t-xl bg-border">
        {property.image_url ? (
          <img src={property.image_url} alt={property.title} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-ink-dim text-sm">
            No image
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleLike(property.id); setLiked(!liked) }}
          className={`absolute top-2 right-2 flex size-7 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
            liked
              ? 'bg-terracotta text-white shadow-sm'
              : 'bg-white/70 text-ink-muted hover:bg-white hover:text-terracotta'
          }`}
        >
          <Heart className={`size-3.5 ${liked ? 'fill-current' : ''}`} />
        </button>
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
