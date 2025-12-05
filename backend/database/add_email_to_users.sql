-- Add email column to users table for password reset
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Add index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Optional: Add comment
COMMENT ON COLUMN users.email IS 'User email address for password reset and notifications';
