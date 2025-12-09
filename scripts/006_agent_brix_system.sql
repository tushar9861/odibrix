-- Add Brix Points system and additional agent features
-- Run this migration to add gamification and enhanced agent tracking

-- Add brix_points column to agents table if not exists
ALTER TABLE agents ADD COLUMN IF NOT EXISTS brix_points INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS specialization TEXT[];
ALTER TABLE agents ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_best_agent BOOLEAN DEFAULT FALSE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS best_agent_month TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) DEFAULT 2.00;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS total_sales NUMERIC DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Create agent_brix_history table for tracking points
CREATE TABLE IF NOT EXISTS agent_brix_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  awarded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_reviews table
CREATE TABLE IF NOT EXISTS agent_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default email templates
INSERT INTO email_templates (name, subject, body, variables) VALUES
('welcome_agent', 'Welcome to OdiBrix Family! 🏠', 'Dear {{agent_name}},

Welcome to OdiBrix! We are thrilled to have you as part of our growing family of real estate professionals.

Your agent account has been approved and you can now:
- List properties on our platform
- Connect with potential buyers
- Earn commissions on successful deals
- Earn Brix Points for your achievements

Login to your dashboard to get started: {{dashboard_link}}

Best regards,
OdiBrix Team', ARRAY['agent_name', 'dashboard_link']),

('brix_reward', 'Congratulations! You earned Brix Points! 🎉', 'Dear {{agent_name}},

Great news! You have been awarded {{points}} Brix Points!

Reason: {{reason}}

Your total Brix Points: {{total_points}}

Keep up the excellent work!

Best regards,
OdiBrix Team', ARRAY['agent_name', 'points', 'reason', 'total_points']),

('best_agent', 'You are the Best Agent of the Month! 🏆', 'Dear {{agent_name}},

Congratulations! You have been selected as the BEST AGENT OF THE MONTH for {{month}}!

Your outstanding performance:
- Properties Listed: {{listings}}
- Leads Generated: {{leads}}
- Total Sales: ₹{{sales}}
- Brix Points: {{points}}

As a reward, you will receive a special badge on your profile and bonus Brix Points!

Thank you for your dedication to OdiBrix.

Best regards,
OdiBrix Management', ARRAY['agent_name', 'month', 'listings', 'leads', 'sales', 'points']),

('property_approved', 'Your Property Has Been Approved! ✅', 'Dear {{agent_name}},

Your property listing "{{property_title}}" has been approved and is now live on OdiBrix!

Property Details:
- Location: {{location}}
- Price: ₹{{price}}

You have earned 10 Brix Points for this listing!

View your listing: {{property_link}}

Best regards,
OdiBrix Team', ARRAY['agent_name', 'property_title', 'location', 'price', 'property_link'])

ON CONFLICT DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE agent_brix_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_brix_history
CREATE POLICY "Agents can view own brix history" ON agent_brix_history
  FOR SELECT USING (
    agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage brix history" ON agent_brix_history
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for agent_reviews
CREATE POLICY "Public can view approved reviews" ON agent_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Admins can manage reviews" ON agent_reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for email_templates
CREATE POLICY "Admins can manage email templates" ON email_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agents_region ON agents(region);
CREATE INDEX IF NOT EXISTS idx_agents_brix_points ON agents(brix_points DESC);
CREATE INDEX IF NOT EXISTS idx_agents_is_best ON agents(is_best_agent);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_agent ON leads(agent_id);
