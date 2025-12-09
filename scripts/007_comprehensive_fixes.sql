-- =====================================================
-- COMPREHENSIVE DATABASE FIXES
-- Run this script to fix all agent, property, and lead issues
-- =====================================================

-- 1. Add missing columns to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lat double precision;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lng double precision;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS document_urls text[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS images_count integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_number_shown boolean DEFAULT false;

-- 2. Add missing columns to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS kyc_verified boolean DEFAULT false;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS kyc_doc_urls text[];
ALTER TABLE agents ADD COLUMN IF NOT EXISTS profile_verified boolean DEFAULT false;

-- 3. Add missing columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_number_shown boolean DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_agent_id uuid REFERENCES agents(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS call_count integer DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_called_at timestamptz;

-- 4. Create property_images table for better image management
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  url text NOT NULL,
  thumbnail_url text,
  order_idx integer DEFAULT 0,
  file_size integer,
  mime_type text,
  uploaded_at timestamptz DEFAULT now()
);

-- 5. Create property_documents table
CREATE TABLE IF NOT EXISTS property_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  url text NOT NULL,
  document_type text, -- 'ownership', 'permission', 'tax', 'other'
  document_name text,
  uploaded_at timestamptz DEFAULT now()
);

-- 6. Create agent_kyc_documents table
CREATE TABLE IF NOT EXISTS agent_kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  document_type text NOT NULL, -- 'aadhaar', 'pan', 'address_proof', 'photo'
  url text NOT NULL,
  verified boolean DEFAULT false,
  verified_at timestamptz,
  verified_by uuid,
  uploaded_at timestamptz DEFAULT now()
);

-- 7. Create brix_transactions table for proper financial tracking
CREATE TABLE IF NOT EXISTS brix_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  agent_id uuid REFERENCES agents(id),
  delta integer NOT NULL, -- positive for credit, negative for debit
  reason text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  processed_by uuid -- admin who pushed the reward
);

-- 8. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_approval_status ON properties(approval_status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_region ON agents(region);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);

-- 9. Enable RLS on new tables
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE brix_transactions ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for property_images
CREATE POLICY "Public can view property images" ON property_images FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage property images" ON property_images FOR ALL USING (auth.role() = 'authenticated');

-- 11. Create RLS policies for property_documents
CREATE POLICY "Authenticated can view property documents" ON property_documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage property documents" ON property_documents FOR ALL USING (auth.role() = 'authenticated');

-- 12. Create RLS policies for agent_kyc_documents
CREATE POLICY "Agents can view own KYC" ON agent_kyc_documents FOR SELECT USING (
  agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
);
CREATE POLICY "Agents can upload own KYC" ON agent_kyc_documents FOR INSERT WITH CHECK (
  agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all KYC" ON agent_kyc_documents FOR ALL USING (auth.role() = 'authenticated');

-- 13. Create RLS policies for brix_transactions
CREATE POLICY "Users can view own brix transactions" ON brix_transactions FOR SELECT USING (
  user_id = auth.uid() OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage brix transactions" ON brix_transactions FOR ALL USING (auth.role() = 'authenticated');

-- 14. Update function to auto-create agent record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, email, name, phone, role, provider, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, users.name),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    updated_at = NOW();

  -- If role is agent, create agent record
  IF NEW.raw_user_meta_data->>'role' = 'agent' THEN
    INSERT INTO public.agents (
      user_id,
      agency_name,
      status,
      brix_points,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      'pending',
      50, -- Welcome bonus
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Create trigger for new user handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 16. Also update existing users who signed up as agents but don't have agent records
INSERT INTO agents (user_id, agency_name, status, brix_points, created_at, updated_at)
SELECT 
  u.id,
  u.name,
  'pending',
  50,
  NOW(),
  NOW()
FROM users u
WHERE u.role = 'agent'
AND NOT EXISTS (SELECT 1 FROM agents a WHERE a.user_id = u.id)
ON CONFLICT (user_id) DO NOTHING;
