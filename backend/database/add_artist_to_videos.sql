-- Add artist column to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS artist TEXT;
