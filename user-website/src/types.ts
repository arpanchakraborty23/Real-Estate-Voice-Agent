export interface Property {
  id: string
  title: string
  location: string
  price: number
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  image_url: string
  description: string
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
