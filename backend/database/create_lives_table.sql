-- Create lives table
CREATE TABLE IF NOT EXISTS lives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE lives ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read lives" ON lives FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert lives" ON lives FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update lives" ON lives FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete lives" ON lives FOR DELETE USING (true);
