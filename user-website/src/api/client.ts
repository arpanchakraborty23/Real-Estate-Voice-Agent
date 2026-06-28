import type { Property, PropertyFilters, Inquiry, UserPreferences, SavedSearch, LikedProperty, UserProfile } from '@/types'

const BASE_URL = '/api/v1'

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

export async function fetchUserProfile(clerkToken: string): Promise<UserProfile> {
  const data = await request<Record<string, unknown>>('/user/me', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clerkToken}`,
    },
  })
  return {
    id: data.id as string,
    clerk_user_id: data.clerk_user_id as string,
    firstName: (data.first_name as string) || null,
    lastName: (data.last_name as string) || null,
    email: data.email as string,
    phone: (data.phone as string) || null,
    role: (data.role as string) || 'buyer',
    imageUrl: (data.profile_image as string) || null,
    createdAt: data.created_at as string,
  }
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

export async function fetchUserPreferences(): Promise<UserPreferences> {
  return request<UserPreferences>('/user/preferences')
}

export async function updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
  return request<UserPreferences>('/user/preferences', {
    method: 'PATCH',
    body: JSON.stringify(preferences),
  })
}

export async function fetchSavedSearches(): Promise<SavedSearch[]> {
  return request<SavedSearch[]>('/user/saved-searches')
}

export async function createSavedSearch(search: Omit<SavedSearch, 'id' | 'createdAt'>): Promise<SavedSearch> {
  return request<SavedSearch>('/user/saved-searches', {
    method: 'POST',
    body: JSON.stringify(search),
  })
}

export async function deleteSavedSearch(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/user/saved-searches/${id}`, {
    method: 'DELETE',
  })
}

export async function fetchLikedProperties(): Promise<LikedProperty[]> {
  return request<LikedProperty[]>('/user/liked-properties')
}

export async function likeProperty(propertyId: string): Promise<LikedProperty> {
  return request<LikedProperty>('/user/liked-properties', {
    method: 'POST',
    body: JSON.stringify({ propertyId }),
  })
}

export async function unlikeProperty(propertyId: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/user/liked-properties/${propertyId}`, {
    method: 'DELETE',
  })
}
