
-- SUPABASE SCHEMA FOR POOJA ESSENTIALS SUBSCRIPTION SYSTEM
-- Execute this in the Supabase SQL Editor

-- 1. Create Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    plan_price BIGINT NOT NULL, -- Stored in paise (integer)
    status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'cancelled', 'pending')),
    razorpay_payment_id TEXT,
    billing_cycle_start TIMESTAMPTZ,
    next_billing_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id) -- Only one active/primary subscription entry per user
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL UNIQUE,
    razorpay_payment_id TEXT,
    amount BIGINT NOT NULL, -- Total including GST (in paise)
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed')),
    gst_amount BIGINT NOT NULL, -- GST component in paise
    invoice_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Subscription Logs Table
CREATE TABLE IF NOT EXISTS public.subscription_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('subscribed', 'paused', 'resumed', 'cancelled', 'renewed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Users can only see their own data)
CREATE POLICY "Users can view their own subscription"
    ON public.subscribers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.subscribers 
        WHERE subscribers.id = orders.subscriber_id 
        AND subscribers.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own logs"
    ON public.subscription_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.subscribers 
        WHERE subscribers.id = subscription_logs.subscriber_id 
        AND subscribers.user_id = auth.uid()
    ));

-- 6. Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
