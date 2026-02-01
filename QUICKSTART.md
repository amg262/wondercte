# 🚀 Quick Start Guide

Get WonderCTE running in 5 minutes!

## Prerequisites

- Bun installed (if not: `powershell -c "irm bun.sh/install.ps1 | iex"`)
- PostgreSQL database (we recommend [Neon](https://neon.tech) - free tier available)

## 1. Install Dependencies

```bash
bun install
```

## 2. Setup Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL:

```env
DATABASE_URL="postgresql://user:password@host/database"
```

## 3. Initialize Database

```bash
# Push database schema
bun run db:push

# Seed with sample questions
bun run seed
```

## 4. Start Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## OAuth Setup (Optional)

For authentication to work, you need OAuth credentials:

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable OAuth → Get credentials
3. Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create app → Add Facebook Login → Get credentials
3. Add to `.env.local`:
   ```env
   FACEBOOK_CLIENT_ID="your-app-id"
   FACEBOOK_CLIENT_SECRET="your-app-secret"
   ```

## Available Commands

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run db:push      # Push schema to database
bun run seed         # Seed sample questions
bun run db:studio    # Open database GUI
bun run lint         # Run linter
```

## Troubleshooting

### "DATABASE_URL is not set"
- Check that `.env.local` exists
- Verify DATABASE_URL is set correctly

### "Failed to connect to database"
- Test your database URL is accessible
- For Neon, ensure `?sslmode=require` is in the URL

### "OAuth not working"
- Verify credentials are correct in `.env.local`
- Check redirect URIs are configured correctly
- Use `http://localhost:3000/api/auth/callback/google` for Google
- Use `http://localhost:3000/api/auth/callback/facebook` for Facebook

## Next Steps

1. ✅ Take a test
2. ✅ Check the leaderboard
3. ✅ Create a group
4. ✅ Invite friends
5. ✅ Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))

## Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🚀 Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 📊 Project overview: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

Happy testing! 🧠✨
