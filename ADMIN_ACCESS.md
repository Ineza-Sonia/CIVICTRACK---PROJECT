# CIVICTRACK — Admin Access

Administrators use the **same Sign In page** as citizens. There is no separate "Admin Login" link for security reasons.

## How to sign in as admin

1. Go to `/login` (click "Sign In" or "Track Your Report" from the home page).
2. Enter these credentials:
   - **Email:** `admin@civictrack.gov`
   - **Password:** `Admin@2024`
3. You will be redirected to the Admin Dashboard at `/admin`.

## Security note

- Do **not** share these credentials or add them to public documentation.
- For production, use a real backend with proper authentication and change the default password immediately.
- The admin dashboard is only accessible after signing in; the `/admin` route is not linked in the public navigation.
