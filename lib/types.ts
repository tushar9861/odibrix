export interface Lead {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  lead_type: "book_visit" | "floor_plan" | "consultation" | "contact"
  visit_type?: string
  preferred_date?: string
  preferred_time?: string
  property_interest?: string
  plot_size?: string
  budget?: string
  message?: string
  status: "new" | "contacted" | "qualified" | "converted" | "closed"
  notes?: string
  agent_id?: string
  property_id?: string
}

export interface Property {
  id: string
  created_at: string
  title: string
  description?: string
  property_type: "villa" | "apartment" | "plot" | "commercial" | "farmhouse"
  status: "available" | "sold" | "reserved" | "upcoming"
  approval_status?: "pending" | "approved" | "rejected"
  price?: number
  area_sqft?: number
  bedrooms?: number
  bathrooms?: number
  location?: string
  address?: string
  amenities?: string[]
  images?: string[]
  model_3d_url?: string
  featured: boolean
  agent_id?: string
  category_id?: string
  view_count?: number
  lead_count?: number
  rejection_reason?: string
}

export interface Payment {
  id: string
  created_at: string
  lead_id?: string
  amount: number
  currency: string
  payment_type: "floor_plan" | "consultation" | "booking"
  payment_status: "pending" | "completed" | "failed" | "refunded"
  payment_method?: string
  transaction_id?: string
  metadata?: Record<string, unknown>
}

export interface Testimonial {
  id: string
  created_at: string
  name: string
  location?: string
  rating: number
  content: string
  image_url?: string
  property_type?: string
  is_featured: boolean
  is_approved: boolean
}

export interface SiteVisit {
  id: string
  created_at: string
  lead_id?: string
  visit_date: string
  visit_time: string
  visit_type: "physical" | "virtual"
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  assigned_agent?: string
  notes?: string
}

export interface Agent {
  id: string
  created_at: string
  updated_at?: string
  user_id?: string
  status: "pending" | "approved" | "suspended" | "rejected"
  agency_name?: string
  city?: string
  region?: string
  phone?: string
  alternate_phone?: string
  kyc_type?: string
  kyc_document_url?: string
  bank_name?: string
  bank_account?: string
  bank_ifsc?: string
  upi_id?: string
  referral_code?: string
  brix_points: number
  total_listings: number
  total_leads: number
  total_views: number
  total_sales: number
  commission_rate: number
  rating: number
  review_count: number
  bio?: string
  profile_image?: string
  specialization?: string[]
  is_best_agent: boolean
  best_agent_month?: string
  approved_at?: string
  approved_by?: string
  suspension_reason?: string
  // Joined from users table
  name?: string
  email?: string
}

export interface BrixHistory {
  id: string
  agent_id: string
  points: number
  reason: string
  awarded_by?: string
  created_at: string
}

export interface AgentReview {
  id: string
  agent_id: string
  customer_name: string
  customer_email?: string
  rating: number
  review?: string
  is_approved: boolean
  created_at: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables?: string[]
  is_active: boolean
  created_at: string
}
