# SkillTube

SkillTube is an **AI-enabled assessment platform**.

- Paste a **YouTube link**
- Generate **MCQs** (planned feature)
- Take assessments to test and improve your skills

This repository contains the Next.js web app under `web-app/`.

## Tech Stack

- Next.js (App Router)
- Prisma + PostgreSQL
- NextAuth (Google OAuth) with **database-backed sessions**
- TailwindCSS (v4)
- Poppins font via `next/font`

## Prerequisites

- Node.js (recommended: LTS)
- PostgreSQL running locally
- Google OAuth credentials

## Environment Variables

Create / update `web-app/.env`:

```env
DATABASE_URL="postgresql://postgres:12345@localhost:5432/postgres?schema=public"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-a-random-secret>"

GOOGLE_CLIENT_ID="<google-client-id>"
GOOGLE_CLIENT_SECRET="<google-client-secret>"
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Google OAuth Setup

In Google Cloud Console:

- Create OAuth Client ID (Web application)
- Add an authorized redirect URI:

```
http://localhost:3000/api/auth/callback/google
```

## Install

From the `web-app/` folder:

```bash
npm install
```

## Database Setup (Prisma)

Run migrations:

```bash
npx prisma migrate dev
```

If you run into a Windows `EPERM` error when generating Prisma Client (often due to file locks / antivirus / OneDrive sync):

- Stop running Node/Next processes
- Then re-run:

```bash
npx prisma generate
```

## Run the App

```bash
npm run dev
```

Open:

- Landing page: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- Dashboard (protected): `http://localhost:3000/dashboard`

## Routes

- `app/page.js`: Landing page
- `app/login/page.js`: Login (Google sign-in)
- `app/dashboard/page.js`: Dashboard (ChatGPT-like UI; paste YouTube URL)
- `app/api/auth/[...nextauth]/route.js`: NextAuth handler

## Project Structure

- `app/`: Next.js routes
- `components/`: Reusable UI components
- `lib/`: Auth + Prisma helpers
- `prisma/`: Prisma schema and migrations

## Author

Built by **Nagapavan A**
