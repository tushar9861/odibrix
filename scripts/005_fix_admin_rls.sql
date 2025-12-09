-- Fix RLS policies for admin operations on categories and properties tables
-- Run this script to allow authenticated admins to manage categories and properties

-- First, let's make sure RLS is enabled but with proper policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Authenticated can manage categories" ON categories;

DROP POLICY IF EXISTS "Public can view properties" ON properties;
DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;
DROP POLICY IF EXISTS "Authenticated can manage properties" ON properties;

-- Categories policies
-- Allow anyone to view active categories
CREATE POLICY "Public can view active categories" 
ON categories FOR SELECT 
USING (is_active = true);

-- Allow authenticated users to do everything with categories (for admin)
CREATE POLICY "Authenticated can manage categories" 
ON categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Properties policies
-- Allow anyone to view approved/available properties
CREATE POLICY "Public can view properties" 
ON properties FOR SELECT 
USING (true);

-- Allow authenticated users to do everything with properties (for admin)
CREATE POLICY "Authenticated can manage properties" 
ON properties FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Grant necessary permissions to authenticated role
GRANT ALL ON categories TO authenticated;
GRANT ALL ON properties TO authenticated;

-- Also ensure the uploads table has correct policies for image storage tracking
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage uploads" ON uploads;
DROP POLICY IF EXISTS "Authenticated can manage uploads" ON uploads;
DROP POLICY IF EXISTS "Public can view active uploads" ON uploads;

CREATE POLICY "Public can view active uploads" 
ON uploads FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated can manage uploads" 
ON uploads FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

GRANT ALL ON uploads TO authenticated;
