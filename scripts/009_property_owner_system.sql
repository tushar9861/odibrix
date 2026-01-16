-- Create property owners table
CREATE TABLE IF NOT EXISTS property_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  kyc_type TEXT CHECK (kyc_type IN ('aadhar', 'pan', 'passport')),
  kyc_document_url TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  property_papers_url TEXT[],
  papers_status TEXT DEFAULT 'pending' CHECK (papers_status IN ('pending', 'verified', 'rejected')),
  registration_type TEXT DEFAULT 'self' CHECK (registration_type IN ('self', 'agent_referral')),
  referring_agent_id UUID REFERENCES agents(id),
  profile_image_url TEXT,
  bio TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  priority_label TEXT DEFAULT 'Mid' CHECK (priority_label IN ('Low', 'Mid', 'High')),
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  total_emails_sent INTEGER DEFAULT 0,
  total_properties INTEGER DEFAULT 0,
  notes TEXT
);

-- Create indexes for faster queries
CREATE INDEX idx_property_owners_user_id ON property_owners(user_id);
CREATE INDEX idx_property_owners_status ON property_owners(status);
CREATE INDEX idx_property_owners_region ON property_owners(region);
CREATE INDEX idx_property_owners_referring_agent ON property_owners(referring_agent_id);

-- Link properties to owners
ALTER TABLE properties ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES property_owners(id);
CREATE INDEX idx_properties_owner_id ON properties(owner_id);

-- Add owner insights table
CREATE TABLE IF NOT EXISTS owner_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES property_owners(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  leads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  rental_deals INTEGER DEFAULT 0,
  sales_deals INTEGER DEFAULT 0,
  last_inquiry_date TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_owner_insights_owner_id ON owner_insights(owner_id);
CREATE INDEX idx_owner_insights_property_id ON owner_insights(property_id);

-- Enable RLS
ALTER TABLE property_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_insights ENABLE ROW LEVEL SECURITY;

-- Policies for property owners to view/edit their own data
CREATE POLICY "Owners can view their own profile" ON property_owners
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Owners can update their own profile" ON property_owners
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin can view all owners
CREATE POLICY "Admins can view all owners" ON property_owners
  FOR SELECT
  USING (true);

-- Agents can view owners they referred
CREATE POLICY "Agents can view referred owners" ON property_owners
  FOR SELECT
  USING (referring_agent_id IN (
    SELECT id FROM agents WHERE user_id = auth.uid()
  ));
