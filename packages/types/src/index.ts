// ─── Users ───────────────────────────────────────────────
export type UserRole = 'user' | 'business' | 'admin'

export interface User {
  user_id: string
  role: UserRole
  email: string
  username: string
  avatar_url?: string
  is_premium: boolean
  created_at: string
  updated_at: string
}

// ─── Cities ──────────────────────────────────────────────
export interface City {
  city_id: string
  name: string
  country: string
  latitude: number
  longitude: number
  is_active: boolean
}

// ─── Categories ──────────────────────────────────────────
export type CategoryType = 'bar' | 'restaurant' | 'club' | 'concert' | 'event' | 'other'

export interface Category {
  category_id: string
  name: string
  type: CategoryType
  icon_url?: string
}

// ─── Plans & Subscriptions ───────────────────────────────
export type PlanName = 'Basic' | 'Pro' | 'Premium'

export interface Plan {
  plan_id: string
  name: PlanName
  price: number
  features: string
}

export interface Subscription {
  subscription_id: string
  start_date: string
  end_date?: string
  is_active: boolean
  created_at: string
  plan_id: string
}

// ─── Establishments ──────────────────────────────────────
export interface Establishment {
  establishment_id: string
  name: string
  description?: string
  address: string
  latitude: number
  longitude: number
  phone?: string
  website?: string
  instagram?: string
  ambiance?: string
  tags?: string[]
  click_count: number
  view_count: number
  is_validated: boolean
  created_at: string
  updated_at: string
  user_id: string
  category_id: string
  subscription_id: string
  city_id: string
}

// ─── Events ──────────────────────────────────────────────
export interface Event {
  event_id: string
  title: string
  description?: string
  start_datetime: string
  end_datetime?: string
  type?: string
  price_min?: number
  price_max?: number
  booking_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
  establishment_id: string
}

// ─── Reviews ─────────────────────────────────────────────
export interface Review {
  review_id: string
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
  created_at: string
  updated_at: string
  establishment_id: string
  user_id: string
}

// ─── Opening Hours ───────────────────────────────────────
export interface OpeningHour {
  hours_id: string
  day_of_week: number  // 0=Lun … 6=Dim
  open_time: string    // "18:00:00"
  close_time: string   // "02:00:00"
  is_closed: boolean
  establishment_id: string
}

// ─── Features ────────────────────────────────────────────
export type FeatureCategory = 'ambiance' | 'accessibilite' | 'services'

export interface Feature {
  feature_id: string
  slug: string
  label: string
  icon: string
  category: FeatureCategory
  sort_order: number
}

export interface EstablishmentFeature {
  feature_id: string
  enabled: boolean
  value_text?: string | null
  features: Feature
}

// ─── Menu ─────────────────────────────────────────────────
export interface MenuItem {
  menu_id: string
  name: string
  description?: string | null
  price_from?: number | null
  price_to?: number | null
  sort_order: number
}

// ─── Establishment full (avec relations) ─────────────────
export interface EstablishmentFull extends Establishment {
  categories: Category | null
  cities: City | null
  photos: Photo[]
  events: Event[]
  opening_hours: OpeningHour[]
  reviews: Review[]
  establishment_features: EstablishmentFeature[]
  establishment_menu: MenuItem[]
}

// ─── Misc ─────────────────────────────────────────────────
export interface Photo {
  photo_id: string
  url: string
  entity_type: 'establishment' | 'event'
  entity_id: string
  is_cover: boolean
  created_at: string
}

export interface Favorite {
  favorite_id: string
  created_at: string
  user_id: string
  establishment_id: string
}

export interface Notification {
  notification_id: string
  title: string
  body: string
  type: 'event' | 'promo' | 'system' | 'review' | 'favorite'
  is_read: boolean
  entity_type?: 'event' | 'establishment'
  entity_id?: string
  created_at: string
  user_id: string
}