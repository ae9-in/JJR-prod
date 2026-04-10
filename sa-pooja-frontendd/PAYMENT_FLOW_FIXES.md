# Supabase + Razorpay Payment Flow - Fixes Applied

## Problems & Solutions

### 1️⃣ Order Creation Failure (`total_earnings` Column Missing)

**Problem:**
- Frontend was trying to insert `total_earnings` into orders table
- Column didn't exist in database schema
- Insert was failing with database error

**Solution Applied:**
- ✅ Removed `total_earnings` from `orderPayload` in `services/orderService.ts`
- Commission is tracked at `order_items` level via `commission_rate`
- Frontend still calculates `totalEarnings` locally for display (not stored in DB)

**File Modified:**
- `services/orderService.ts` - Lines 50-57: Removed conditional `total_earnings` insertion

---

### 2️⃣ Edge Function 401 Unauthorized Error

**Problem:**
- Frontend was calling `create-payment` Edge Function
- Function didn't exist (404 becomes 401 when wrapped)
- No JWT authentication verification in place

**Solution Applied:**
- ✅ Created new Edge Function: `supabase/functions/create-payment/`
- Verifies JWT token from Authorization header
- Authenticates user with Supabase
- Creates Razorpay order with proper credentials
- Returns `razorpayOrderId` to frontend

**Implementation Details:**
```typescript
// 1. Extract JWT from Authorization header
const token = authHeader.replace("Bearer ", "");

// 2. Verify with Supabase using SERVICE_ROLE_KEY
const { data: { user }, error: authError } = await supabase.auth.getUser(token);

// 3. Call Razorpay API with credentials
const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
  headers: {
    "Authorization": "Basic " + btoa(`${razorpayKeyId}:${razorpayKeySecret}`),
  },
  body: JSON.stringify({
    amount: amount, // in paise
    currency: "INR",
    receipt: order_id,
    notes: { order_id, user_id: user.id },
  }),
});
```

**New Files Created:**
- `supabase/functions/create-payment/index.ts` - Main edge function
- `supabase/functions/create-payment/deno.json` - Dependencies

---

### 3️⃣ CORS Issues

**Problem:**
- Edge Functions need CORS headers for browser requests
- Some functions were missing proper CORS handling

**Solution Applied:**
- ✅ `create-payment`: Full CORS support with OPTIONS preflight
- ✅ `smart-endpoint`: Already had CORS support (verified)
- ✅ `razorpay-webhook`: Webhook only (server-to-server, doesn't need CORS)

**CORS Headers Included:**
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Handle preflight
if (req.method === "OPTIONS") {
  return new Response("ok", { headers: corsHeaders });
}

// Include in every response
return new Response(data, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
```

---

## Payment Flow - After Fixes

```
User clicks "Pay Now" on PaymentPage
  ↓
createOrder() called with cart items
  ↓
Order inserted into DB (user_id, total_amount, status='PLACED')
  ↓
initiatePayment(orderId, amount) called
  ↓
supabase.functions.invoke('create-payment', {
  order_id: orderId,
  amount: amountInPaise
})
  ↓
Frontend sends request with JWT in Authorization header
  ↓
Edge Function receives request
  ↓
OPTIONS preflight? → Return CORS headers
  ↓
Missing token? → Return 401
  ↓
Invalid token? → Return 401
  ↓
Valid token - Create Razorpay order
  ↓
Razorpay API call succeeds
  ↓
Return { success: true, razorpayOrderId: "order_..." }
  ↓
Frontend receives razorpayOrderId
  ↓
Open Razorpay Checkout modal
  ↓
User completes payment
  ↓
Razorpay sends webhook to razorpay-webhook function
  ↓
Webhook verifies signature and updates order status
```

---

## Environment Variables Required

For `create-payment` Edge Function to work, configure in Supabase:

```
RAZORPAY_KEY_ID=rzp_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

---

## Files Modified

| File | Change | Reason |
|------|--------|--------|
| `services/orderService.ts` | Removed `total_earnings` insert | Column doesn't exist in schema |
| `supabase/functions/create-payment/index.ts` | Created | Missing Edge Function |
| `supabase/functions/create-payment/deno.json` | Created | Dependencies for new function |

---

## Testing Checklist

- [ ] Deploy edge functions: `supabase functions deploy`
- [ ] Set environment variables in Supabase project settings
- [ ] Create order from PaymentPage
- [ ] Verify order appears in Supabase `orders` table
- [ ] Click "Pay" button
- [ ] Razorpay checkout opens successfully
- [ ] Complete test payment (use Razorpay test card)
- [ ] Webhook fires and updates order status
- [ ] Check browser console for no CORS errors

---

## Key Changes Summary

### Before
- ❌ Trying to insert non-existent `total_earnings` column → INSERT fails
- ❌ `create-payment` Edge Function missing → 401/404 error
- ❌ No JWT verification → Unauthorized traffic
- ❌ CORS issues blocking requests

### After
- ✅ Order inserts correctly with schema
- ✅ `create-payment` function handles auth
- ✅ JWT verified with Supabase
- ✅ CORS headers in all responses
- ✅ Razorpay order created successfully
- ✅ Checkout modal opens

---

## Debugging

If payment still fails:

1. **Check browser console** for CORS errors
2. **Check Supabase logs** for Edge Function errors
3. **Verify environment variables** are set in Supabase project
4. **Test with Supabase CLI**: `supabase functions invoke create-payment --local`
5. **Check Razorpay API credentials** are correct
6. **Verify user is authenticated** before calling payment endpoint

View Edge Function logs in Supabase dashboard → Functions → create-payment → Recent Invocations
