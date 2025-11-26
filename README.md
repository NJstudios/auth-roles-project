# Auth + Neon + Drizzle Starter

This project is a full-stack TypeScript application using **Next.js App Router**, **Neon Serverless Postgres**, **Drizzle ORM**, and **custom authentication** built from scratch.

## 🧱 Tech Stack

| Layer         | Technology          |
|---------------|---------------------|
| Frontend      | Next.js (App Router) |
| Styling       | Tailwind CSS (optional) |
| Backend       | API routes in `app/api` |
| ORM           | Drizzle ORM         |
| Database      | Neon Postgres       |
| Auth          | Custom cookie/session-based |
| Deployment    | Vercel or Node server |
| Package Mgmt  | pnpm                |

---

## 🗂️ File Structure

```txt
.
├── app/                    # App Router pages and layouts
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── me/                # Profile page (requires auth)
│   ├── api/               # API routes (auth logic, user info, etc.)
│   └── layout.tsx        # Root layout
├── drizzle/               # Drizzle migrations & config
│   ├── config.ts
├── src/
│   ├── db/
│   │   ├── schema.ts     # Drizzle schema definitions
│   │   └── client.ts     # Drizzle client config
│   └── lib/
│       ├── auth-guards.ts  # Middleware for auth-protected routes
│       ├── session.ts      # Session handling (get/set)
│       ├── hash.ts         # Password hashing utils
│       └── current-user.ts # Gets current user from cookie
├── public/
├── .env.local              # Secrets & config
├── drizzle.config.ts       # Drizzle CLI config
├── next.config.ts          # Next.js config (no ESM)
├── tsconfig.json           # TS config
├── package.json
└── README.md


🛠️ Setup Instructions
1. Clone and Install
git clone <your-repo-url>
cd <project-folder>
pnpm install

2. Configure .env.local

Create .env.local and add:

DATABASE_URL=<your_neon_database_url>
SESSION_SECRET=<random_secret>


Make sure your DATABASE_URL is in the Neon postgresql://... format with ?sslmode=require.

3. Push Schema to Neon
pnpm drizzle-kit push


This generates and pushes the schema from src/db/schema.ts to your Neon DB.

🔐 Auth Flow

User signs up via /signup → password is hashed.

On login (/login), a signed cookie is set.

getCurrentUser() reads the cookie and fetches user from DB.

Protected pages like /me use requireUser() from auth-guards.ts.

🧪 Dev Scripts
pnpm dev         # Run dev server
pnpm drizzle-kit generate  # Generate SQL migrations from schema
pnpm drizzle-kit push      # Push schema to Neon

✅ TODO (Optional)

 Add Tailwind CSS

 Add validation with Zod

 Add API tests with Vitest

 Add session expiration + refresh

 Deploy to Vercel with DATABASE_URL as secret
