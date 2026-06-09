import type { PropertyRecommendation } from '@/types'
import { PropertyCard } from '@/components/PropertyCard'

interface PropertyRecommendationsProps {
  properties: PropertyRecommendation[]
}

export function PropertyRecommendations({ properties }: PropertyRecommendationsProps) {
  if (properties.length === 0) return null

  return (
    <div>
      <h3 className="mb-3 font-display text-base font-semibold text-ink">
        Recommended Properties
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  )
}
