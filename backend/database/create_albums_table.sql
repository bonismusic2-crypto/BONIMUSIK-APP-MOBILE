-- Create albums table
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

-- Enable Row Level Security
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Public can read albums" ON albums
    FOR SELECT
    USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Authenticated users can insert albums" ON albums
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Authenticated users can update albums" ON albums
    FOR UPDATE
    USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Authenticated users can delete albums" ON albums
    FOR DELETE
    USING (true);
