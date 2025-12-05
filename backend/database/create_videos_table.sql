-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert videos" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update videos" ON videos FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete videos" ON videos FOR DELETE USING (true);
