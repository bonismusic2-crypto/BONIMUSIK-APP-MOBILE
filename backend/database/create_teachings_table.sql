-- Create teachings table
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

-- Enable Row Level Security
ALTER TABLE teachings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read teachings" ON teachings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert teachings" ON teachings FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update teachings" ON teachings FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete teachings" ON teachings FOR DELETE USING (true);
