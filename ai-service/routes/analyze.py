"""
Route definitions for the /analyze prefix.
Handles file validation, orchestrates extraction and LLM analysis.
Supports text-based and image-based documents via Gemini Vision.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, UploadFile

from models.schemas import ReportAnalysisResponse
from services.extractor import extract
from services.llm import analyze_report, analyze_report_with_images

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analyze", tags=["analyze"])

_MAX_FILE_BYTES = 20 * 1024 * 1024  # 20 MB

_ALLOWED_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


@router.post("/report", response_model=ReportAnalysisResponse)
async def analyze_report_endpoint(file: UploadFile) -> ReportAnalysisResponse:
    """
    Accept a document upload, extract text/images, and return AI analysis.
    Uses Gemini Vision for scanned PDFs and images — no OCR dependency needed.
    """
    if file is None or not file.filename:
        raise HTTPException(status_code=400, detail="No file was provided.")

    if file.content_type not in _ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Accepted: PDF, JPG, PNG, WEBP, DOCX",
        )

    file_bytes = await file.read()
    if len(file_bytes) > _MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 20 MB limit.")

    # Extract text and/or images
    try:
        extraction = extract(file_bytes, file.filename)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.error("Extraction failed: %s", str(exc))
        raise HTTPException(status_code=500, detail="Failed to process the file.") from exc

    # Route to appropriate LLM method
    try:
        if extraction.mode == "vision" and extraction.images:
            result = await analyze_report_with_images(
                images=extraction.images,
                supplementary_text=extraction.text,
            )
        elif extraction.text:
            result = await analyze_report(extraction.text)
        else:
            raise HTTPException(status_code=400, detail="No readable content found.")
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        logger.error("LLM analysis failed: %s", str(exc))
        raise HTTPException(status_code=500, detail="AI analysis failed.") from exc

    return result
