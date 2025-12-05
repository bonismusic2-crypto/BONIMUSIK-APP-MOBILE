-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for admins table (we use service role)
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Create first admin account
-- Email: admin@bonismusic.com
-- Password: Admin123456 (CHANGE THIS IN PRODUCTION!)
INSERT INTO admins (email, password_hash, full_name)
VALUES (
    'admin@bonismusic.com',
    '$2b$10$2l3zBZPs2R9Y0YvaIeNz5OUFdQC/HY4u70KxJAchQVHM6lgHZtgma',
    'Administrator'
)
ON CONFLICT (email) DO NOTHING;
