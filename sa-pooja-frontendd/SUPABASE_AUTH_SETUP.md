# Supabase Authentication Setup Guide

## Environment Variables

Add the following to your `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings:
- Go to https://supabase.com/dashboard
- Select your project
- Copy URL from Settings > API
- Copy anon/public key from Settings > API

## Database Setup

Create a `users` table in Supabase with the following schema:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'USER',
  referral_code TEXT,
  contact TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Features Implemented

### 1. AuthContext (`context/AuthContext.tsx`)
- Global authentication state management
- `useAuth()` hook for accessing auth state
- Session persistence across page refreshes
- Real-time auth state updates

### 2. Authentication Pages
- **LoginPage** (`pages/LoginPage.tsx`) - Email + Password login
- **RegisterPage** (`pages/RegisterPage.tsx`) - Email + Password registration with validation

### 3. Protected Routes (`components/ProtectedRoute.tsx`)
- Reusable component to protect member-only pages
- Redirects unauthenticated users to `/login`
- Shows loading state while checking authentication

### 4. Route Protection Strategy
**Protected (Member-Only):**
- `/dashboard` - Portal/Member Dashboard
- `/margins` - Margin Information (Members only)
- `/order-history` - Order History (Members only)

**Public (No Authentication Required):**
- `/` - Home
- `/about` - About
- `/catalog` - Product Catalog
- `/login` - Login Page
- `/register` - Registration Page
- `/cart` - Shopping Cart
- `/address` - Delivery Address (Guest Checkout)
- `/payment` - Payment Page (Guest Checkout)

## Key Changes Made

### Files Added:
1. `context/AuthContext.tsx` - Global auth context with Supabase integration
2. `components/ProtectedRoute.tsx` - Route protection wrapper

### Files Modified:
1. `App.tsx` - Added AuthProvider wrapper
2. `router/AppRoutes.tsx` - Implemented route protection strategy
3. `pages/LoginPage.tsx` - Supabase email/password auth
4. `pages/RegisterPage.tsx` - Supabase registration with password
5. `components/Navbar.tsx` - Uses new useAuth hook, added logout button

## Usage

### Using Authentication in Components

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, session, isLoading, signIn, signOut } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Protecting a Route

```tsx
<Route path="/protected-page" element={<ProtectedRoute element={<MyPage />} />} />
```

## Important Notes

1. **Payment Flow Remains Public** - `/payment` and `/address` routes are accessible without authentication for guest checkout
2. **Catalog is Public** - All users can view the product catalog
3. **Cart is Public** - Anyone can add items to cart before deciding to authenticate
4. **Session Persistence** - User sessions persist across page refreshes automatically
5. **No Breaking Changes** - Existing AppContext and payment logic remain untouched

## Testing Checklist

- [ ] Can register new account with email/password
- [ ] Can login with registered credentials
- [ ] Can access protected routes when authenticated
- [ ] Redirected to login when accessing protected route without auth
- [ ] Can browse catalog without logging in
- [ ] Can add items to cart as guest
- [ ] Can proceed to payment/address as guest
- [ ] Can logout from navbar
- [ ] Session persists on page refresh
- [ ] Error messages display gracefully for invalid credentials

## Troubleshooting

If you see "Missing Supabase environment variables" error:
1. Verify `.env.local` file exists in project root
2. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
3. Restart the development server

If users table doesn't exist:
1. Run the SQL creation script above in Supabase SQL Editor
2. Ensure Row Level Security (RLS) is disabled for initial testing
