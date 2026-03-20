"""
LLM service: sends extracted text AND/OR images to Gemini and returns a validated
ReportAnalysisResponse. Supports both text-only and multimodal (vision) inputs.
"""

from __future__ import annotations

import logging
import os

from google import genai
from google.genai import types

from models.schemas import ReportAnalysisResponse
from utils.prompt import get_system_prompt, get_user_prompt

logger = logging.getLogger(__name__)

_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", ""))
_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


async def analyze_report(report_text: str) -> ReportAnalysisResponse:
    """Analyze a text-based report."""
    system_instruction = get_system_prompt()
    user_message = get_user_prompt(report_text)

    try:
        response = await _client.aio.models.generate_content(
            model=_MODEL,
            contents=user_message,
            config={
                "system_instruction": system_instruction,
                "response_mime_type": "application/json",
                "response_schema": ReportAnalysisResponse,
                "temperature": 0.2,
            },
        )
    except Exception as exc:
        logger.error("LLM API call failed: %s", str(exc))
        raise RuntimeError("AI service is currently unavailable. Please try again.") from exc

    try:
        if not response.parsed:
            raise ValueError("Response was empty.")
        return response.parsed
    except Exception as exc:
        logger.error("LLM response failed validation: %s", str(exc))
        raise RuntimeError("AI response did not match expected structure.") from exc


async def analyze_report_with_images(
    images: list[bytes],
    supplementary_text: str | None = None,
) -> ReportAnalysisResponse:
    """
    Analyze a medical report using Gemini Vision (multimodal).
    Sends images directly to the model — no OCR needed.
    """
    system_instruction = get_system_prompt()

    # Build multimodal content parts
    parts: list[types.Part] = []

    # Add text context if available
    prompt_text = (
        "Analyze the following medical report image(s). "
        "Extract all medical data visible in the document and provide a structured analysis. "
        "Read all text, tables, values, and medical information from the images carefully."
    )
    if supplementary_text:
        prompt_text += f"\n\nAdditional text extracted from the document:\n{supplementary_text}"

    parts.append(types.Part.from_text(text=prompt_text))

    # Add each image as an inline part
    for i, img_bytes in enumerate(images):
        # Detect mime type from magic bytes
        mime = "image/png"
        if img_bytes[:2] == b"\xff\xd8":
            mime = "image/jpeg"
        elif img_bytes[:4] == b"RIFF":
            mime = "image/webp"

        parts.append(types.Part.from_bytes(data=img_bytes, mime_type=mime))

    try:
        response = await _client.aio.models.generate_content(
            model=_MODEL,
            contents=parts,
            config={
                "system_instruction": system_instruction,
                "response_mime_type": "application/json",
                "response_schema": ReportAnalysisResponse,
                "temperature": 0.2,
            },
        )
    except Exception as exc:
        logger.error("Vision LLM call failed: %s", str(exc))
        raise RuntimeError("AI service is currently unavailable. Please try again.") from exc

    try:
        if not response.parsed:
            raise ValueError("Response was empty.")
        return response.parsed
    except Exception as exc:
        logger.error("Vision response failed validation: %s", str(exc))
        raise RuntimeError("AI response did not match expected structure.") from exc
