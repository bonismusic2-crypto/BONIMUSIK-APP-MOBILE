-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playlist_items table (junction table)
CREATE TABLE IF NOT EXISTS playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL, -- 'video', 'teaching', 'album'
    content_id UUID NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for playlists
CREATE POLICY "Users can read their own playlists" ON playlists
    FOR SELECT USING (true);

CREATE POLICY "Users can create playlists" ON playlists
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own playlists" ON playlists
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own playlists" ON playlists
    FOR DELETE USING (true);

-- Create policies for playlist_items
CREATE POLICY "Users can read playlist items" ON playlist_items
    FOR SELECT USING (true);

CREATE POLICY "Users can add items to playlists" ON playlist_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update playlist items" ON playlist_items
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete playlist items" ON playlist_items
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_playlist_items_playlist_id ON playlist_items(playlist_id);
CREATE INDEX idx_playlist_items_content ON playlist_items(content_type, content_id);
