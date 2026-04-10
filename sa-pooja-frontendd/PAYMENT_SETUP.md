# Payment Flow Setup - Deploy Checklist

## Step 1: Update Environment Variables in Supabase

In your Supabase project dashboard:

1. Go to **Project Settings** → **Functions**
2. Add these environment variables:

```
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
```

**Where to find these:**
- Go to https://dashboard.razorpay.com/
- Settings → API Keys
- Copy "Key ID" and "Key Secret"

---

## Step 2: Deploy Edge Functions

Deploy the new `create-payment` function and any updates:

```bash
# From project root
supabase functions deploy create-payment

# Or deploy all functions
supabase functions deploy
```

**Verify deployment:**
```bash
supabase functions list
```

You should see:
- `create-payment` ✓
- `smart-endpoint` ✓
- `razorpay-webhook` ✓

---

## Step 3: Verify Database Schema

Ensure your `orders` table has these columns (NOT `total_earnings`):

```
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- total_amount (numeric)
- status (text: 'PLACED', 'PROCESSING', 'COMPLETED', 'FAILED')
- created_at (timestamp)
- updated_at (timestamp, optional)
```

Commission is tracked in `order_items.commission_rate`, not at the order level.

---

## Step 4: Test Payment Flow

### Local Testing

1. Start the dev server:
```bash
npm run dev
```

2. Go to checkout page
3. Create an order
4. Click "Pay Now"
5. Razorpay checkout should open

### Test Razorpay Payment

Use Razorpay test card:
- **Card Number:** `4111111111111111`
- **Expiry:** Any future date (e.g., 12/32)
- **CVV:** Any 3 digits (e.g., 123)

---

## Step 5: Production Deployment

1. **Update frontend** (if needed):
```bash
npm run build
```

2. **Deploy files** to your hosting

3. **Verify environment variables** in Supabase are set for production

---

## Troubleshooting

### Error: "401 Unauthorized"
- ✅ User must be logged in before paying
- ✅ Check browser DevTools → Network → create-payment request
- ✅ Verify JWT token is in Authorization header

### Error: "CORS blocked"
- ✅ Check Edge Function includes CORS headers
- ✅ Browser console should show the error

### Error: "Razorpay order creation failed"
- ✅ Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct
- ✅ Check Supabase function logs for exact error

### Order not appearing in database
- ✅ Check `orders` table schema matches expected columns
- ✅ Verify user is authenticated
- ✅ Check browser console for insert errors

---

## Files Changed

✅ `services/orderService.ts` - Removed `total_earnings` insert
✅ `supabase/functions/create-payment/index.ts` - NEW
✅ `supabase/functions/create-payment/deno.json` - NEW

---

## Next Steps

1. Deploy edge functions: `supabase functions deploy`
2. Set Razorpay credentials in Supabase environment
3. Test payment flow end-to-end
4. Check both successful and failed payments

**Questions?**
- Check [PAYMENT_FLOW_FIXES.md](PAYMENT_FLOW_FIXES.md) for detailed technical info
- Review Edge Function logs in Supabase dashboard
- Test with Razorpay sandbox first, then enable production
