import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-ivory">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <img src="/logo.svg" alt="New House" className="h-7" />
            </div>
            <p className="text-sm text-ink-muted">
              Your dream home awaits. Let us help you find the perfect property.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-ink">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-ink-muted">
              <span className="flex items-center gap-2">
                <Phone className="size-4 text-terracotta" />
                +1 (555) 123-4567
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4 text-terracotta" />
                hello@newhouse.com
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-terracotta" />
                123 Dream St, Cityville
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-ink">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-ink-muted">
              <a href="/properties" className="hover:text-terracotta transition-colors">Properties</a>
              <a href="/about" className="hover:text-terracotta transition-colors">About Us</a>
              <a href="/contact" className="hover:text-terracotta transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border-light pt-6 text-center text-xs text-ink-dim">
          &copy; {new Date().getFullYear()} New House Real Estate. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
