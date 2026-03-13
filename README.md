# Dhristi — DNA Health Analyzer

A production-grade hackathon MVP that accepts 23andMe raw DNA file uploads, parses SNP markers, and returns health-related genetic predisposition insights with AI-powered wellness recommendations.

> **Informational only. Not medical advice. Not for diagnosis, treatment, or emergency use.**

---

## Project Structure

```
K:\Dhrishti\
├── backend/          # Express API (Node.js)
│   ├── src/
│   │   ├── config/         # Environment config
│   │   ├── controllers/    # Route handlers
│   │   ├── data/           # Trait rules database
│   │   ├── middleware/     # Upload, error handling
│   │   ├── routes/         # API routes
│   │   ├── services/       # Parser, trait engine, Gemini
│   │   ├── utils/          # Prompt builder, JSON parser
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── test/               # Sample data & API tests
│   ├── railway.json        # Railway deployment config
│   ├── railway.toml        # Railway deployment config (alt)
│   └── .env.example
│
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities & animation variants
│   │   ├── pages/          # Page components
│   │   ├── sections/       # Page sections
│   │   ├── services/       # API services
│   │   └── data/           # Mock data
│   ├── vercel.json         # Vercel deployment config
│   └── index.html
│
└── README.md         # This file
```

---

## Quick Start (Local)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

Backend starts on **http://localhost:3001**

### 2. Frontend

```bash
cd frontend
npm install
npx vite
```

Frontend starts on **http://localhost:5173**

### 3. Test

Upload the sample file `backend/test/sample_genome.txt` through the UI, or run the API test:

```bash
cd backend
node test/api-test.js
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `CORS_ORIGIN` | `http://localhost:5173` | Frontend URL |
| `MAX_FILE_SIZE_MB` | `50` | Max upload size |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window |
| `RATE_LIMIT_MAX` | `20` | Max requests per window |
| `GEMINI_API_KEY` | — | **Required** for AI recommendations. Get from [Google AI Studio](https://aistudio.google.com/) |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/analyze` | Upload & analyze genome file |
| `POST` | `/api/recommendations` | AI-powered wellness recommendations |

---

## Deployment

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Import in [Vercel](https://vercel.com/new)
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. **Edit `vercel.json`** — replace `YOUR_RAILWAY_BACKEND_URL` with your Railway backend URL
7. Deploy

### Backend → Railway

1. Push `backend/` to a GitHub repo
2. Import in [Railway](https://railway.app/new)
3. Add environment variables in Railway dashboard:
   - `PORT` = `3001` (or let Railway assign)
   - `CORS_ORIGIN` = `https://your-vercel-app.vercel.app`
   - `GEMINI_API_KEY` = your key
   - `NODE_ENV` = `production`
4. Railway auto-detects Node.js and deploys
5. Health check at `/api/health`

### Post-deployment checklist

- [ ] Set `CORS_ORIGIN` on Railway to your Vercel URL
- [ ] Set `GEMINI_API_KEY` on Railway
- [ ] Update `vercel.json` rewrites with your Railway URL
- [ ] Test upload flow end-to-end
- [ ] Verify recommendation generation works

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Motion |
| Backend | Express 5, Node.js |
| AI | Google Gemini (`gemini-2.0-flash`) |
| Upload | Multer (disk storage, 50MB) |
| Security | Helmet, CORS, express-rate-limit |
| Validation | Zod |

---

## Features

- 🧬 Parse 23andMe raw DNA data (.txt / .zip)
- 🔬 Analyze 4 health-related trait categories
- 🤖 AI-powered precautions & balanced diet recommendations
- 🔒 Privacy-first: genome data processed in memory, auto-deleted
- ⚕️ Compliant disclaimers on every result
- 📱 Responsive light theme with premium animations

---

## License

MIT — Built for hackathon demonstration purposes.
