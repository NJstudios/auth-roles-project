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
