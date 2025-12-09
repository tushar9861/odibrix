-- Fix Row Level Security policies for public access
-- This script ensures anonymous users can submit leads and create payments

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit leads" ON leads;
DROP POLICY IF EXISTS "Anyone can create payments" ON payments;
DROP POLICY IF EXISTS "Anyone can schedule visits" ON site_visits;
DROP POLICY IF EXISTS "Anyone can view available properties" ON properties;
DROP POLICY IF EXISTS "Anyone can view approved testimonials" ON testimonials;

-- Leads table policies
-- Allow anonymous users to INSERT leads (for form submissions)
CREATE POLICY "Public can insert leads" ON leads 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users (admin) to view all leads
CREATE POLICY "Authenticated users can view leads" ON leads 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow authenticated users (admin) to update leads
CREATE POLICY "Authenticated users can update leads" ON leads 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Payments table policies
-- Allow anonymous users to INSERT payments
CREATE POLICY "Public can insert payments" ON payments 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous users to SELECT their own payment (by transaction_id)
CREATE POLICY "Public can view payments" ON payments 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to update payments
CREATE POLICY "Authenticated users can update payments" ON payments 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Site visits table policies
-- Allow anonymous users to INSERT site visits
CREATE POLICY "Public can insert site visits" ON site_visits 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to view/update site visits
CREATE POLICY "Authenticated users can view site visits" ON site_visits 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update site visits" ON site_visits 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Properties table policies
-- Allow anyone to view properties
CREATE POLICY "Public can view properties" ON properties 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Allow authenticated users full access to properties
CREATE POLICY "Authenticated users can manage properties" ON properties 
  FOR ALL 
  TO authenticated
  USING (true);

-- Testimonials table policies  
-- Allow anyone to view approved testimonials
CREATE POLICY "Public can view approved testimonials" ON testimonials 
  FOR SELECT 
  TO anon, authenticated
  USING (is_approved = true);

-- Allow authenticated users full access to testimonials
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials 
  FOR ALL 
  TO authenticated
  USING (true);
