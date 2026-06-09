import type { Property, PropertyFilters, Inquiry } from '@/types'

const BASE_URL = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchProperties(filters?: PropertyFilters): Promise<Property[]> {
  const params = new URLSearchParams()
  if (filters?.type) params.set('type', filters.type)
  if (filters?.bedrooms) params.set('bedrooms', String(filters.bedrooms))
  if (filters?.location) params.set('location', filters.location)
  if (filters?.priceMin) params.set('price_min', String(filters.priceMin))
  if (filters?.priceMax) params.set('price_max', String(filters.priceMax))
  const qs = params.toString()
  return request<Property[]>(`/properties${qs ? `?${qs}` : ''}`)
}

export async function submitInquiry(inquiry: Inquiry): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiry),
  })
}
