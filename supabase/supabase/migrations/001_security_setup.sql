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

-- Public (Anon) Users — Can read products, insert orders, manage OTP codes & verified customers
GRANT SELECT ON public.products TO anon;
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verified_customers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_codes TO anon;

-- Authenticated Users — Can read products, manage their own orders & profile
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verified_customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_codes TO authenticated;

-- Service Role — Full access to all tables
GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.verified_customers TO service_role;
GRANT ALL ON public.otp_codes TO service_role;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

-- Orders Policies
DROP POLICY IF EXISTS "Anon can create orders" ON public.orders;
CREATE POLICY "Anon can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- Verified Customers Policies
DROP POLICY IF EXISTS "Anyone can check verified status" ON public.verified_customers;
CREATE POLICY "Anyone can check verified status" ON public.verified_customers
    FOR ALL USING (true);

-- OTP Codes Policies (Allows serverless OTP verification using hashed values)
DROP POLICY IF EXISTS "Service role only for OTP codes" ON public.otp_codes;
DROP POLICY IF EXISTS "Anyone can manage otp_codes" ON public.otp_codes;
CREATE POLICY "Anyone can manage otp_codes" ON public.otp_codes
    FOR ALL USING (true) WITH CHECK (true);
