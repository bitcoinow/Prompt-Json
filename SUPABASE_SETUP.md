# How to Configure Supabase

This application can work in demo mode without Supabase, but to enable full functionality like data persistence and real authentication, you'll need to configure Supabase.

## Quick Start (Demo Mode)
The app works out of the box in demo mode:
- Any email/password will work for sign in/sign up
- Data is stored in memory only (lost on refresh)
- Perfect for testing the UI and AI features

## Configure Supabase (Optional)

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Credentials
1. In your Supabase dashboard, go to Settings → API
2. Copy the **Project URL** and **anon public** key
3. Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database Tables
The app will automatically create the necessary tables when you run:
```bash
npm run db:push
```

This creates:
- `users` table for user profiles
- `prompt_conversions` table for storing conversion history

### 4. Restart Your App
Stop and restart your development server:
```bash
npm run dev
```

## Features Enabled with Supabase
- ✅ Real user authentication
- ✅ Persistent data storage
- ✅ Conversion history
- ✅ User profiles
- ✅ Session management

## Demo Mode Limitations
- ❌ No data persistence
- ❌ Mock authentication only
- ❌ No real user accounts
- ❌ Data lost on refresh

## Troubleshooting

### "supabaseUrl is required" Error
Make sure your `.env.local` file contains the Supabase URL and anon key.

### Authentication Not Working
1. Check that your Supabase project is active
2. Verify the URL and keys are correct
3. Make sure there are no typos in the environment variables

### Database Issues
Run `npm run db:push` to create the required tables.

## Need Help?
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Next.js Integration Guide](https://supabase.com/docs/guides/with-nextjs)