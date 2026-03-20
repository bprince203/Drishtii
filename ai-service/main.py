"""
FastAPI application entry point for the Prajnaa AI Health Platform microservice.

CORS is fully open here (allow_origins=["*"]) because this service is an
internal microservice only reachable from the Express backend — it is NOT
exposed directly to the public internet in production.
"""

from __future__ import annotations

import logging
import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load .env BEFORE any local modules so env vars are available at import time
load_dotenv()

from routes.analyze import router as analyze_router


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Startup validation ────────────────────────────────────────────────────────
if not os.environ.get("GEMINI_API_KEY"):
    logger.warning("GEMINI_API_KEY is not set — LLM calls will fail at runtime.")

app = FastAPI(
    title="Prajnaa Medical Report Analyzer",
    description="AI microservice — transforms medical documents and images into patient-friendly structured JSON via Gemini Vision.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(analyze_router)


@app.get("/health", tags=["health"])
async def health_check() -> dict:
    """Liveness probe — returns ok when the service is up."""
    return {"status": "ok"}


# ── Dev entrypoint ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
