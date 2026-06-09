export interface Builder {
  builder_id: string
  builder_name: string
  builder_phone: string | null
  builder_email: string | null
}

export interface BuilderCreate {
  builder_id: string
  builder_name: string
  builder_phone?: string | null
  builder_email?: string | null
}

export interface Property {
  property_id: string
  builder_id: string
  project_name: string
  property_type: string | null
  bedrooms: number | null
  location: string | null
  price: number
  status: string | null
  amenities: string | null
  description: string | null
}

export interface PropertyCreate {
  property_id: string
  builder_id: string
  project_name: string
  property_type?: string | null
  bedrooms?: number | null
  location?: string | null
  price: number
  status?: string | null
  amenities?: string | null
  description?: string | null
}

export interface PropertyUpdate {
  project_name?: string
  property_type?: string | null
  bedrooms?: number | null
  location?: string | null
  price?: number
  status?: string | null
  amenities?: string | null
  description?: string | null
}

export interface RecommendRequest {
  budget_min?: number
  budget_max?: number
  bedrooms?: number
  location?: string
  property_type?: string
  amenities?: string
  status?: string
  top_k?: number
}

export interface RecommendResponse {
  property: Property
  score: number
}
