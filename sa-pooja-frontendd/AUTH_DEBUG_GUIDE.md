# Auth Flow Debugging Guide

## Enhanced Logging
I've added comprehensive console logging to help debug the authentication flow. This will show exactly what's happening at each step.

## Test Steps

### 1. **Test Initial Load (Unauthenticated)**
- Open DevTools (F12 or Cmd+Option+I)
- Go to the Console tab
- Open your app (refresh if already open)
- **Expected logs:**
  ```
  [AuthContext] initializeAuth: Starting
  [AuthContext] initializeAuth: Current session found: null (or your email if already logged in)
  [AuthContext] initializeAuth: Complete, setting isLoading to false
  ```

### 2. **Test Signup Flow**
- Click "Register" or go to `/register`
- Fill in: Name, Email, Contact, Password
- Click "Sign Up"
- **Expected logs:**
  ```
  [AuthContext] signUp: Creating user with email...
  // User created in Supabase Auth
  // Profile inserted into database
  // Redirects to login page
  ```

### 3. **Test Login Flow (The Critical Test)**
- Go to `/login` or click "Login"
- Enter email and password from previous signup
- Click "Login"
- **Watch the Console and watch for these logs in order:**

  #### Step 1: SignIn Called
  ```
  [LoginPage] signIn attempt for: your-email@example.com
  ```

  #### Step 2: SignIn Completes
  ```
  [LoginPage] signIn succeeded, waiting for onAuthStateChange...
  [LoginPage] Redirect check - authLoading: true user: null
  ```

  #### Step 3: SIGNED_IN Event Fires
  ```
  [AuthContext] onAuthStateChange event: SIGNED_IN
  [AuthContext] SIGNED_IN event detected, user: your-email@example.com
  [AuthContext] loadUserProfile called for userId: [USER_ID]
  ```

  #### Step 4: Profile Load
  ```
  [AuthContext] Profile found: { id, email, full_name, ... }
  [AuthContext] Setting user from profile: { id, email, name, role, ... }
  ```
  
  OR if profile doesn't exist yet:
  ```
  [AuthContext] Profile not found, creating minimal user object
  [AuthContext] Setting minimal user: { id, email, name: '', role: 'USER', ... }
  ```

  #### Step 5: Redirect Triggered
  ```
  [LoginPage] Redirect check - authLoading: false user: your-email@example.com
  [LoginPage] Redirecting to dashboard
  ```

### 4. **Test Session Persistence**
- After successfully logging in (should be on dashboard)
- Press F5 to refresh the page
- **Expected logs:**
  ```
  [LoginPage] Redirect check - authLoading: true user: null
  [AuthContext] initializeAuth: Starting
  [AuthContext] initializeAuth: Current session found: your-email@example.com
  [AuthContext] loadUserProfile called for userId: [USER_ID]
  [AuthContext] Profile found: { ... }
  [AuthContext] Setting user from profile: { ... }
  [LoginPage] Redirect check - authLoading: false user: your-email@example.com
  // Should see dashboard, no redirect back to login
  ```

## Common Issues & Solutions

### Issue: Login succeeds but doesn't redirect
**Check for:** 
1. Does the `SIGNED_IN` event fire? (Look for `[AuthContext] onAuthStateChange event: SIGNED_IN`)
2. Does `loadUserProfile` get called? (Look for `[AuthContext] loadUserProfile called for userId:`)
3. Does the profile load succeed? (Look for `[AuthContext] Profile found:` or `[AuthContext] Profile not found`)
4. Does `setUser` get called? (Look for `[AuthContext] Setting user from profile:`)
5. Does the redirect check see the user? (Look for final redirect check with user populated)

**If SIGNED_IN doesn't fire:**
- Check Supabase credentials in `.env.local`
- Ensure the profiles table exists in Supabase
- Try logging out completely and trying again

**If profile doesn't load:**
- Check that the profiles table has the correct columns: `id`, `email`, `full_name`, `role`, etc.
- Ensure the profile was actually created during signup

### Issue: Page shows "Loading..." forever
**Check for:**
- Does `initializeAuth: Complete` appear in logs?
- If not, there might be a database connection issue
- Check that `setIsLoading` is being called with `false`

### Issue: Signup works but redirects to wrong page
**Expected flow:** Signup → Success Message → Redirect to /login
- Check RegisterPage logs for success/error messages
- Ensure redirect is to `/login`, not `/dashboard`

## Console Log Legend
- `[LoginPage]` - Logs from the login page component
- `[AuthContext]` - Logs from the authentication context
- `[AuthContext] onAuthStateChange event:` - Shows which auth event fired (SIGNED_IN, SIGNED_OUT, etc.)
- `[AuthContext] loadUserProfile called` - Profile query started
- `[AuthContext] Profile found:` - Profile successfully loaded from database
- `[AuthContext] Profile not found, creating minimal user` - No profile in DB but user is authenticated
- `[AuthContext] Setting user:` - User state is being updated

## Next Steps After Testing

1. **If redirect works:** Congratulations! Remove the console.log statements and the auth system is production-ready.
2. **If redirect fails:** The console logs should show exactly where it fails. Share the console output and I can fix the issue.

## Removing Debug Logs (When Ready for Production)

Delete all lines containing `console.log('[AuthContext]'` and `console.log('[LoginPage]'` from:
- `context/AuthContext.tsx`
- `pages/LoginPage.tsx`
