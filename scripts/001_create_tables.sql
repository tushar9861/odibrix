-- OdiBrix Real Estate Database Schema
-- Create leads table for all form submissions
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  lead_type TEXT NOT NULL CHECK (lead_type IN ('book_visit', 'floor_plan', 'consultation', 'contact')),
  visit_type TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  property_interest TEXT,
  plot_size TEXT,
  budget TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  notes TEXT
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('villa', 'apartment', 'plot', 'commercial', 'farmhouse')),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'upcoming')),
  price DECIMAL(12, 2),
  area_sqft INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  location TEXT,
  address TEXT,
  amenities TEXT[],
  images TEXT[],
  model_3d_url TEXT,
  featured BOOLEAN DEFAULT false
);

-- Create payments table for floor plan purchases
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('floor_plan', 'consultation', 'booking')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  metadata JSONB
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  location TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  image_url TEXT,
  property_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true
);

-- Create site_visits table
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id),
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  visit_type TEXT NOT NULL CHECK (visit_type IN ('physical', 'virtual')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  assigned_agent TEXT,
  notes TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Public read access for properties and testimonials (no auth required)
CREATE POLICY "Anyone can view available properties" ON properties 
  FOR SELECT USING (status != 'sold' OR status IS NULL);

CREATE POLICY "Anyone can view approved testimonials" ON testimonials 
  FOR SELECT USING (is_approved = true);

-- Allow anonymous inserts for leads (public form submissions)
CREATE POLICY "Anyone can submit leads" ON leads 
  FOR INSERT WITH CHECK (true);

-- Allow anonymous inserts for payments (public payment flow)
CREATE POLICY "Anyone can create payments" ON payments 
  FOR INSERT WITH CHECK (true);

-- Allow anonymous inserts for site visits
CREATE POLICY "Anyone can schedule visits" ON site_visits 
  FOR INSERT WITH CHECK (true);
