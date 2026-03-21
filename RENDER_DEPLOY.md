# Prajnaa — Render Deployment Guide

## Deploy on Render (step by step)

### 1. Push code to GitHub
See [SETUP.md](./SETUP.md) for GitHub push instructions.

### 2. Create Render Blueprint
1. Go to [render.com](https://render.com) → **New** → **Blueprint**
2. Connect your GitHub repo
3. Render will auto-detect `render.yaml` at the repo root
4. Click **Apply** to create both services

### 3. Set Environment Variables
Go to each service → **Environment** → Add these:

#### Backend (`prajnaa-backend`) Environment Variables

| Variable | Value | Notes |
|---|---|---|
| `CLERK_SECRET_KEY` | `sk_live_...` | From Clerk Dashboard |
| `CLERK_PUBLISHABLE_KEY` | `pk_live_...` | From Clerk Dashboard |
| `GROQ_API_KEY` | `gsk_...` | From Groq Console |
| `DATABASE_URL` | `postgresql://...@db.supabase.co:6543/postgres?pgbouncer=true` | Supabase pooler URL |
| `DIRECT_URL` | `postgresql://...@db.supabase.co:5432/postgres` | Supabase direct URL |
| `FRONTEND_URL` | `https://prajnaa-frontend.onrender.com` | Your Render frontend URL |
| `TWILIO_ACCOUNT_SID` | `ACxxxxx` | Optional — for SMS |
| `TWILIO_AUTH_TOKEN` | `your_token` | Optional — for SMS |
| `TWILIO_PHONE_NUMBER` | `+1xxxxxxxxxx` | Optional — for SMS |
| `TWILIO_WHATSAPP_NUMBER` | `whatsapp:+14155238886` | Optional — for WhatsApp |
| `SMTP_HOST` | `smtp.gmail.com` | Optional — for Email |
| `SMTP_PORT` | `587` | Optional — for Email |
| `SMTP_USER` | `yourmail@gmail.com` | Optional — for Email |
| `SMTP_PASS` | `your_app_password` | Optional — for Email |
| `AI_SERVICE_BASE_URL` | `https://your-ai-service.onrender.com` | Optional if AI service deployed separately |

#### Frontend (`prajnaa-frontend`) Environment Variables

| Variable | Value | Notes |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | From Clerk Dashboard |
| `VITE_API_URL` | `https://prajnaa-backend.onrender.com` | Your Render backend URL |

### 4. Deploy
Click **Deploy** — Render will build and deploy both services.

### 5. Update Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → **Settings**
2. **Allowed origins**: add your Render frontend URL
3. **Redirect URLs**: add `https://prajnaa-frontend.onrender.com`

### 6. Verify Deployment
- Backend health: `https://prajnaa-backend.onrender.com/api/health`
- Frontend: `https://prajnaa-frontend.onrender.com`

---

## Important Notes

- **Free tier**: Render free tier services spin down after 15 minutes of inactivity. First request after idle may take ~30 seconds.
- **Dummy data**: Blood bank features use in-memory dummy data. Data resets when the server restarts.
- **CORS**: The `FRONTEND_URL` env var must match your actual Render frontend URL for CORS to work properly.
- **Clerk**: Both `CLERK_SECRET_KEY` (backend) and `VITE_CLERK_PUBLISHABLE_KEY` (frontend) must be from the same Clerk application.
