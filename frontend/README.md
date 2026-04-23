
# Pooja Essentials Subscription System (Next.js + Supabase)

This is a complete, production-ready subscription module for your pooja essentials brand.

## 🛠️ Stack
- **Frontend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Razorpay (UPI, Card, Net Banking)
- **Styling**: Pure Inline CSS (Georgia Serif & Amber Saffron Palette)

## 📁 Directory Structure
- `supabase_schema.sql`: Run this in your Supabase SQL Editor.
- `app/api/subscription/create-order/route.ts`: Order creation & GST calculation.
- `app/api/subscription/verify-payment/route.ts`: Secure signature verification.
- `app/api/subscription/manage/route.ts`: Pause/Resume/Cancel logic.
- `app/subscription/page.tsx`: The main real-time dashboard and payment UI.

## ⚙️ Setup Instructions
1. **Supabase**: 
   - Execute `supabase_schema.sql` in the SQL Editor.
   - Enable **Realtime** on the `subscribers` table (Database -> Replication -> Source -> select 'subscribers').
2. **Environment Variables**: Add these to your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   # Panchanga generation (server-side)
   ASTROLOGY_API_KEY=your_freeastro_api_key
   ASTROLOGY_API_URL=https://api.freeastroapi.com/api/v1/vedic/panchang
   ```
3. **Dependencies**:
   ```bash
   npm install razorpay @supabase/supabase-js
   ```

## 🔒 Security
- **RLS Enabled**: Users can only see their own subscription data.
- **Service Role**: Used only in API routes to safely bypass RLS for administrative actions.
- **Signature Verification**: Razorpay payments are verified server-side before activating any plan.
