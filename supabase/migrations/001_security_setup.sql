-- ====================================================================
-- DAR AL REHAN — Security & Database Schema Setup Migration
-- Resolves Oct 30 Supabase GRANT requirement & RLS Policies
-- ====================================================================

-- 1. Create OTP Codes Table for Secure Server-Side OTP Hashing
CREATE TABLE IF NOT EXISTS public.otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by phone & expiry
CREATE INDEX IF NOT EXISTS idx_otp_codes_phone_expires ON public.otp_codes(phone, expires_at);

-- 2. Create Verified Customers Table
CREATE TABLE IF NOT EXISTS public.verified_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on phone
CREATE INDEX IF NOT EXISTS idx_verified_customers_phone ON public.verified_customers(phone);

-- 3. Update Orders Table (add razorpay_order_id if not present)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- ====================================================================
-- EXPLICIT GRANTS (Required for Supabase Data API from Oct 30)
-- ====================================================================

-- Public (Anon) Users — Can read products, insert orders (for guest checkout)
GRANT SELECT ON public.products TO anon;
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT ON public.verified_customers TO anon;

-- Authenticated Users — Can read products, manage their own orders & profile
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.verified_customers TO authenticated;

-- Service Role (Backend Edge Functions) — Full access to all tables
GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.verified_customers TO service_role;
GRANT ALL ON public.otp_codes TO service_role;

-- Protect OTP Codes from public API exposure (Only Service Role access)
REVOKE ALL ON public.otp_codes FROM anon, authenticated;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

-- Orders Policies
CREATE POLICY "Anon can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- Verified Customers Policies
CREATE POLICY "Anyone can check verified status" ON public.verified_customers
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage verified customers" ON public.verified_customers
    FOR ALL USING (auth.role() = 'service_role');

-- OTP Codes Policies (Strictly Service Role only)
CREATE POLICY "Service role only for OTP codes" ON public.otp_codes
    FOR ALL USING (auth.role() = 'service_role');
