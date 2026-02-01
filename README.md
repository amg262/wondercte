# WonderCTE - Cognitive Test Challenge

A modern, social cognitive testing platform built with the latest web technologies.

## Features

- 🧠 **Cognitive Tests**: Wonderlic-style tests with multiple question types (math, logic, verbal, spatial)
- 🏆 **Global Leaderboard**: Compete with players worldwide
- 👥 **Friend Groups**: Create private groups and compete with friends
- ⚡ **Real-time Updates**: Live leaderboard updates via Server-Sent Events
- 📱 **Mobile-First**: Responsive design optimized for all devices
- 🔐 **Social Auth**: Sign in with Google or Facebook
- 🚀 **Modern Stack**: Next.js 16, React 19, Bun, Drizzle ORM, Better Auth

## Tech Stack

### Core
- **Bun** - Fast JavaScript runtime (2x faster than Node.js)
- **Next.js 16** - App Router with React Server Components
- **React 19** - Latest concurrent features
- **TypeScript** - Full type safety

### Database & Backend
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe ORM with migrations
- **Better Auth** - Modern authentication with OAuth

### UI & Styling
- **Shadcn UI** - Accessible component library
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icons

### Real-time
- **Server-Sent Events (SSE)** - Live leaderboard updates
- **Server Actions** - Seamless client-server communication

## Getting Started

### Prerequisites

- Bun 1.0+
- PostgreSQL database
- Google OAuth credentials (optional)
- Facebook OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wondercte.git
cd wondercte
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL and OAuth credentials.

4. Run database migrations:
```bash
bun run db:push
```

5. Seed the database with sample questions:
```bash
bun run lib/db/seed.ts
```

6. Start the development server:
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database Setup

### Using Neon (Recommended for development)

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env.local`:
```
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### Local PostgreSQL

```bash
# Create database
createdb wondercte

# Update .env.local
DATABASE_URL="postgresql://localhost:5432/wondercte"
```

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add credentials to `.env.local`

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app
3. Add Facebook Login product
4. Add valid OAuth redirect URI: `http://localhost:3000/api/auth/callback/facebook`
5. Add credentials to `.env.local`

## Available Scripts

```bash
# Development
bun run dev          # Start dev server with Turbopack

# Build & Production
bun run build        # Build for production
bun run start        # Start production server

# Database
bun run db:generate  # Generate migration files
bun run db:migrate   # Run migrations
bun run db:push      # Push schema changes (dev)
bun run db:studio    # Open Drizzle Studio

# Code Quality
bun run lint         # Run ESLint
```

## Project Structure

```
wondercte/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Protected routes
│   ├── api/               # API routes & SSE
│   └── layout.tsx
├── components/
│   ├── ui/                # Shadcn components
│   ├── test/              # Test interface
│   ├── leaderboard/       # Leaderboard components
│   ├── groups/            # Group management
│   └── social/            # Sharing components
├── lib/
│   ├── db/                # Database schema & client
│   ├── auth/              # Auth configuration
│   ├── actions/           # Server Actions
│   ├── sse/               # SSE utilities
│   └── utils/             # Helper functions
└── public/                # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker

```bash
# Build image
docker build -t wondercte .

# Run container
docker run -p 3000:3000 --env-file .env.local wondercte
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Acknowledgments

- Inspired by the Wonderlic cognitive assessment
- Built with modern web technologies for optimal performance
- Designed for social sharing and viral growth

## Support

For issues or questions, please open an issue on GitHub or contact us at support@wondercte.com
