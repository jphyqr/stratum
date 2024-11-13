# Authentication in Your App

This project comes with a pre-configured authentication system using NextAuth.js. For development, it includes a mock authentication system that can be easily replaced with real providers.


## Getting Started

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the environment variables:
```env
NEXTAUTH_SECRET=your-secret-key # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

3. For development, the mock auth system is enabled by default. You can switch users using the auth controls panel in the bottom right corner of your app.

## Available Mock Users
- Admin: admin@example.com
- Regular User: user@example.com
- Super Admin: super@example.com

## Implementing Real Authentication

1. Disable mock auth by removing or setting to false:
```env
NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
```

2. Configure your chosen auth provider:

### Email Provider
```env
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=noreply@example.com
```

### Database Setup
Choose your database adapter and uncomment the relevant environment variables:

#### Prisma
```env
DATABASE_URL="postgresql://..."
```

#### Supabase
```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## Auth Features
- JWT-based sessions
- Role-based access control
- Protected API routes
- Protected pages
- Type-safe authentication
- Customizable user roles and permissions

## Type Safety
The auth system includes full TypeScript support. Custom fields are defined in:
```typescript
// app/types/next-auth.d.ts
```

## Protected Routes
Routes are protected using Next.js middleware:
```typescript
// middleware.ts
```

Use the provided auth hooks in your components:
```typescript
import { useSession } from "next-auth/react"

export function ProtectedComponent() {
  const { data: session } = useSession()
  // ...
}
```