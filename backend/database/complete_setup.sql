-- ============================================
-- BONIS MUSIC - Complete Database Setup
-- Execute this entire script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE ALBUMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read albums" ON albums FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert albums" ON albums FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update albums" ON albums FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete albums" ON albums FOR DELETE USING (true);

-- ============================================
-- 2. CREATE VIDEOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    artist TEXT,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert videos" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update videos" ON videos FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete videos" ON videos FOR DELETE USING (true);

-- ============================================
-- 3. CREATE TEACHINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teachings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    file_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE teachings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read teachings" ON teachings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert teachings" ON teachings FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update teachings" ON teachings FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete teachings" ON teachings FOR DELETE USING (true);

-- ============================================
-- 4. CREATE LIVES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE lives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read lives" ON lives FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert lives" ON lives FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update lives" ON lives FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete lives" ON lives FOR DELETE USING (true);

-- ============================================
-- 5. CREATE STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('covers', 'covers', true),
  ('videos', 'videos', true),
  ('teachings', 'teachings', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. CREATE STORAGE POLICIES
-- ============================================
CREATE POLICY "Public Access for covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Public Access for videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Public Access for teachings" ON storage.objects
  FOR SELECT USING (bucket_id = 'teachings');

CREATE POLICY "Authenticated users can upload teachings" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'teachings');

-- ============================================
-- 7. ADD ROLE COLUMN TO USERS (if not exists)
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- ============================================
-- SETUP COMPLETE
-- ============================================
