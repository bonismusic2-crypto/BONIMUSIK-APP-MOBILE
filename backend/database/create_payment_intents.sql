-- ============================================
-- CREATE PAYMENT INTENTS TABLE
-- For Smart SMS Listener Matching Logic
-- ============================================

CREATE TABLE IF NOT EXISTS payment_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    amount INTEGER NOT NULL,
    phone_number TEXT, -- The number the user says they will pay with (optional)
    plan TEXT NOT NULL, -- 'monthly' or 'yearly'
    status TEXT DEFAULT 'pending', -- pending, matched, expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    matched_at TIMESTAMP WITH TIME ZONE,
    transaction_ref TEXT -- ID transaction from SMS when matched
);

-- Enable RLS
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own intents" ON payment_intents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own intents" ON payment_intents
  FOR SELECT USING (auth.uid() = user_id);

-- Admin policy (Service Role usually bypasses RLS, but for safety)
-- CREATE POLICY "Admins can view all" ... (Service role bypasses this)
