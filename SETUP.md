# Prajnaa — Setup & GitHub Push Guide

## Prerequisites
- Node.js ≥ 18
- Git installed
- GitHub account

## Local Development

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your actual keys
npm install
npm run dev
# Server runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env with your Clerk publishable key
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### AI Service (Python)
```bash
cd ai-service
cp .env.example .env
# Set GEMINI_API_KEY in .env
pip install -r requirements.txt
python main.py
# AI service runs on http://localhost:8000
```

---

## First-time GitHub Setup

```bash
git init
git add .
git commit -m "feat: Prajnaa blood bank feature with dummy data"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prajnaa.git
git push -u origin main
```

## Subsequent Pushes

```bash
git add .
git commit -m "fix: blood bank donor feature fixes"
git push origin main
```

## Branch Workflow for Features

```bash
git checkout -b feature/blood-bank-fix
git add .
git commit -m "fix: donor registration and clerk auth integration"
git push origin feature/blood-bank-fix
# Then open a Pull Request on GitHub
```

---

## Environment Variables Checklist

### Backend (.env)
| Variable | Required | Description |
|---|---|---|
| `CLERK_SECRET_KEY` | Yes | Clerk backend secret |
| `CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `GROQ_API_KEY` | Yes | For AI recommendations |
| `DATABASE_URL` | No* | Supabase with pgbouncer (*dummy data mode works without) |
| `DIRECT_URL` | No* | Supabase direct connection |
| `AI_SERVICE_BASE_URL` | No | Defaults to http://localhost:8000 |
| `FRONTEND_URL` | No | CORS origin, defaults to * |

### Frontend (.env)
| Variable | Required | Description |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | Clerk frontend key |
| `VITE_API_URL` | Yes | Backend URL |
