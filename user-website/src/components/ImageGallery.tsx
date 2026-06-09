import { X } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  onClear: () => void
}

export function ImageGallery({ images, onClear }: ImageGalleryProps) {
  if (images.length === 0) return null

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted">Property Images</span>
        <button onClick={onClear} className="text-ink-dim hover:text-ink transition-colors cursor-pointer">
          <X className="size-3.5" />
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Property ${i + 1}`}
            className="h-24 w-36 shrink-0 rounded-lg object-cover shadow-warm"
          />
        ))}
      </div>
    </div>
  )
}
