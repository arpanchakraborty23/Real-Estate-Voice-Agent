import type {
  Builder, BuilderCreate,
  Property, PropertyCreate, PropertyUpdate,
  RecommendRequest, RecommendResponse,
} from '../types'

const BASE = '/api'

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${body}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  // Builders
  listBuilders: () => request<Builder[]>('/builders'),

  getBuilder: (id: string) => request<Builder>(`/builders/${id}`),

  createBuilder: (data: BuilderCreate) =>
    request<Builder>('/builders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteBuilder: (id: string) =>
    request<void>(`/builders/${id}`, { method: 'DELETE' }),

  // Properties
  listProperties: (params?: Record<string, string | number | undefined>) => {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.entries(params).filter(([_, v]) => v != null).map(([k, v]) => [k, String(v)])
        ).toString()
      : ''
    return request<Property[]>(`/properties${qs}`)
  },

  getProperty: (id: string) => request<Property>(`/properties/${id}`),

  createProperty: (data: PropertyCreate) =>
    request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProperty: (id: string, data: PropertyUpdate) =>
    request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProperty: (id: string) =>
    request<void>(`/properties/${id}`, { method: 'DELETE' }),

  // Recommendation
  recommend: (data: RecommendRequest) =>
    request<RecommendResponse[]>('/recommend', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
