export interface Builder {
  name: string
  phone: string
  email: string
  bio: string
  yearsExperience: number
  projectsCompleted: number
  logo?: string
}

export interface Property {
  id: string
  title: string
  location: string
  price: number
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  lotSize?: string
  yearBuilt?: number
  amenities?: string[]
  image_url: string
  images?: string[]
  description: string
  builder?: Builder
}

export interface PropertyFilters {
  type?: string
  bedrooms?: number
  location?: string
  priceMin?: number
  priceMax?: number
}

export interface Inquiry {
  name: string
  email: string
  phone: string
  message: string
  propertyId?: string
}

export interface AgentMessage {
  role: 'agent' | 'user'
  text?: string
  timestamp: number
}

export interface PropertyRecommendation {
  id: string
  title: string
  location: string
  price: number
  type: string
  bedrooms: number
  image_url: string
}

export interface UserProfile {
  id: string
  clerk_user_id: string
  firstName: string | null
  lastName: string | null
  email: string
  phone: string | null
  role: string
  imageUrl: string | null
  createdAt: string
}

export interface UserPreferences {
  propertyTypes: string[]
  minPrice: number
  maxPrice: number
  bedrooms: number
  bathrooms: number
  locations: string[]
  amenities: string[]
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    newListings: boolean
    priceDrops: boolean
    openHouses: boolean
  }
}

export interface SavedSearch {
  id: string
  name: string
  filters: {
    type?: string
    bedrooms?: number
    location?: string
    priceMin?: number
    priceMax?: number
  }
  createdAt: string
}

export interface LikedProperty {
  id: string
  propertyId: string
  property: Property
  createdAt: string
}
