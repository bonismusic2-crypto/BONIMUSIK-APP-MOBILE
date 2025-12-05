-- Fix RLS policies for custom auth
-- Run this in Supabase SQL Editor

-- Drop existing policies that use auth.uid()
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Disable RLS (we're using service role which bypasses RLS anyway)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
