# WonderCTE Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. ✅ PostgreSQL database (Neon, Vercel Postgres, or self-hosted)
2. ✅ Google OAuth credentials (optional but recommended)
3. ✅ Facebook OAuth credentials (optional but recommended)
4. ✅ Vercel account (or your preferred hosting platform)

## Step 1: Database Setup

### Option A: Neon (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string (it will look like):
   ```
   postgresql://user:password@host.neon.tech/database?sslmode=require
   ```

### Option B: Vercel Postgres

1. In your Vercel project, go to Storage
2. Create a new Postgres database
3. Copy the connection string from the `.env.local` tab

## Step 2: OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.vercel.app/api/auth/callback/google`
7. Copy Client ID and Client Secret

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app or select existing
3. Add "Facebook Login" product
4. Go to Settings > Basic
5. Copy App ID and App Secret
6. Go to Facebook Login > Settings
7. Add Valid OAuth Redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/facebook`
   - Production: `https://your-domain.vercel.app/api/auth/callback/facebook`

## Step 3: Deploy to Vercel

### Via Git (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/wondercte.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `bun run build`
   - Install Command: `bun install`

6. Add environment variables:
   ```
   DATABASE_URL=your_neon_connection_string
   BETTER_AUTH_SECRET=generate_with_openssl_rand_base64_32
   BETTER_AUTH_URL=https://your-domain.vercel.app
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_CLIENT_ID=your_facebook_app_id
   FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

7. Click "Deploy"

### Via Vercel CLI

```bash
# Install Vercel CLI
bun add -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET
vercel env add BETTER_AUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add FACEBOOK_CLIENT_ID
vercel env add FACEBOOK_CLIENT_SECRET
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

## Step 4: Initialize Database

After deployment, you need to run migrations and seed data:

```bash
# Using Drizzle Kit
bun run db:push

# Seed sample questions
bun run lib/db/seed.ts
```

Or connect to your production database locally:

```bash
# Set production DATABASE_URL temporarily
DATABASE_URL="your_production_url" bun run db:push
DATABASE_URL="your_production_url" bun run lib/db/seed.ts
```

## Step 5: Update OAuth Redirect URIs

After deployment, update your OAuth applications with the production URL:

### Google
- Add: `https://your-domain.vercel.app/api/auth/callback/google`

### Facebook
- Add: `https://your-domain.vercel.app/api/auth/callback/facebook`

## Step 6: Verify Deployment

1. Visit your deployed URL
2. Test authentication with Google/Facebook
3. Take a test
4. Check leaderboards
5. Create a group
6. Share invite code

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes | `postgresql://...` |
| `BETTER_AUTH_SECRET` | Secret key for auth (32+ chars) | ✅ Yes | Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Your app URL | ✅ Yes | `https://wondercte.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ⚠️ Optional | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ⚠️ Optional | `GOCSPX-...` |
| `FACEBOOK_CLIENT_ID` | Facebook App ID | ⚠️ Optional | `123456789012345` |
| `FACEBOOK_CLIENT_SECRET` | Facebook App Secret | ⚠️ Optional | `abc123...` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | ✅ Yes | `https://wondercte.vercel.app` |

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify DATABASE_URL is accessible from Vercel
- Check build logs for specific errors

### Authentication Not Working

- Verify OAuth redirect URIs match exactly
- Check that OAuth credentials are correct
- Ensure BETTER_AUTH_URL matches your domain

### Database Connection Issues

- Check DATABASE_URL format
- Verify database allows connections from Vercel IPs
- For Neon, ensure `?sslmode=require` is in connection string

### SSE Not Working

- SSE requires HTTP/2, which Vercel supports
- Check browser console for connection errors
- Verify API route is deployed correctly

## Performance Optimization

### Database
- Ensure indexes are created (handled by Drizzle schema)
- Consider connection pooling for high traffic
- Monitor query performance in production

### Caching
- Next.js automatically caches static pages
- Use `revalidatePath()` to update cached pages
- Consider Redis for additional caching if needed

### CDN
- Vercel automatically uses edge CDN
- Static assets are cached globally
- API routes run on serverless functions

## Monitoring

### Vercel Analytics
- Built-in performance monitoring
- Real User Monitoring (RUM)
- Web Vitals tracking

### Error Tracking (Optional)
- Add Sentry for error tracking:
  ```bash
  bun add @sentry/nextjs
  ```

## Scaling

### Database
- Neon: Automatically scales with branching
- Vercel Postgres: Auto-scaling available
- Self-hosted: Consider read replicas

### Serverless Functions
- Vercel: Automatically scales with traffic
- No server management needed
- Pay per execution

## Cost Estimates

### Free Tier (Hobby)
- Vercel: Free for personal projects
- Neon: 0.5GB storage, 1 branch
- Good for: Development, small projects

### Pro Tier
- Vercel: $20/month
- Neon: $19/month for 10GB
- Good for: Production apps, multiple environments

## Support

- Documentation: Check README.md
- Issues: Create GitHub issue
- Community: Join Discord (if available)

## Next Steps

After deployment:
1. ✅ Share with friends to test
2. ✅ Monitor analytics and errors
3. ✅ Add more test questions
4. ✅ Customize branding
5. ✅ Set up custom domain
6. ✅ Enable social sharing
7. ✅ Consider adding more OAuth providers

Congratulations! Your WonderCTE app is now live! 🎉
