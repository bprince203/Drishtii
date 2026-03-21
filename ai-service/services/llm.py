"""
LLM service: uses Groq (llama-3.3-70b) for text-based analysis and
Gemini Vision for image/scanned-PDF analysis.
Schema matches models/schemas.py ReportAnalysisResponse exactly.
"""

from __future__ import annotations

import json
import logging
import os

from models.schemas import ReportAnalysisResponse

logger = logging.getLogger(__name__)

_GEMINI_MODEL = "gemini-2.5-flash"
_GROQ_MODEL   = "llama-3.3-70b-versatile"


def _get_groq_key() -> str:
    """Read key at call-time so dotenv reload / env injection works."""
    return os.environ.get("GROQ_API_KEY", "")


def _get_gemini_key() -> str:
    return os.environ.get("GEMINI_API_KEY", "")


# ── Exact schema for Groq to follow ──────────────────────────────────────────
_SCHEMA_INSTRUCTION = """
Return ONLY a valid JSON object matching this exact schema (no markdown, no extra keys):
{
  "patient_overview": "string — one sentence about the patient if info available, else 'Not specified'",
  "summary": "string — plain-English 2-3 sentence summary of the report",
  "key_findings": ["string", "..."],
  "vital_signs": [
    {"name": "string", "value": "string", "normal_range": "string", "status": "normal|borderline|abnormal"}
  ],
  "issues": [
    {"name": "string", "description": "string", "severity": "low|moderate|high", "possible_causes": ["string"], "what_it_means": "string"}
  ],
  "medications": [
    {"name": "string", "purpose": "string", "dosage_noted": "string", "common_side_effects": ["string"], "important_notes": "string"}
  ],
  "lifestyle_advice": ["string", "..."],
  "follow_up_actions": ["string", "..."],
  "risk_level": "low|moderate|high",
  "disclaimer": "AI-generated summary for informational purposes only. Not a substitute for professional medical advice."
}
"""

_SYSTEM_PROMPT = (
    "You are a medical report analyzer. Your job is to read medical documents and produce "
    "clear, patient-friendly structured analysis. Always respond with valid JSON only."
)


def _build_prompt(report_text: str) -> str:
    return f"{_SCHEMA_INSTRUCTION}\n\nMedical Report to analyze:\n\n{report_text}"


async def analyze_report(report_text: str) -> ReportAnalysisResponse:
    """Analyze text-based report using Groq (fast, reliable)."""
    key = _get_groq_key()
    if not key:
        raise RuntimeError("GROQ_API_KEY is not configured.")

    from groq import Groq
    client = Groq(api_key=key)

    try:
        completion = client.chat.completions.create(
            model=_GROQ_MODEL,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user",   "content": _build_prompt(report_text)},
            ],
            temperature=0.1,
            max_tokens=3000,
            response_format={"type": "json_object"},
        )
    except Exception as exc:
        logger.error("Groq API call failed: %s", str(exc))
        raise RuntimeError(f"AI analysis failed: {str(exc)}") from exc

    raw = completion.choices[0].message.content or "{}"
    logger.info("Groq raw response length: %d chars", len(raw))

    try:
        parsed = json.loads(raw)
        # Ensure disclaimer is always present
        if not parsed.get("disclaimer"):
            parsed["disclaimer"] = "AI-generated summary for informational purposes only. Not a substitute for professional medical advice."
        return ReportAnalysisResponse(**parsed)
    except Exception as exc:
        logger.error("Schema validation failed: %s\nRaw: %s", str(exc), raw[:500])
        raise RuntimeError(
            f"AI returned a response that did not match the expected format: {str(exc)}"
        ) from exc


async def analyze_report_with_images(
    images: list[bytes],
    supplementary_text: str | None = None,
) -> ReportAnalysisResponse:
    """
    Analyze scanned PDFs/images using Gemini Vision.
    Falls back to Groq text analysis if Gemini key is unavailable or fails.
    """
    gemini_key = _get_gemini_key()

    if gemini_key:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=gemini_key)

            prompt_text = (
                "Analyze the following medical report image(s). "
                "Extract all medical data and provide a structured analysis.\n\n"
                + _SCHEMA_INSTRUCTION
            )
            if supplementary_text:
                prompt_text += f"\n\nAdditional extracted text:\n{supplementary_text}"

            parts: list = [types.Part.from_text(text=prompt_text)]
            for img_bytes in images:
                mime = "image/png"
                if len(img_bytes) >= 2 and img_bytes[0] == 0xFF and img_bytes[1] == 0xD8:
                    mime = "image/jpeg"
                parts.append(types.Part.from_bytes(data=img_bytes, mime_type=mime))

            response = await client.aio.models.generate_content(
                model=os.environ.get("GEMINI_MODEL", _GEMINI_MODEL),
                contents=parts,
                config={
                    "system_instruction": _SYSTEM_PROMPT,
                    "response_mime_type": "application/json",
                    "response_schema": ReportAnalysisResponse,
                    "temperature": 0.1,
                },
            )
            if response.parsed:
                return response.parsed
        except Exception as exc:
            logger.warning("Gemini Vision failed (%s), falling back to Groq", str(exc))

    # Fallback: Groq on supplementary text
    if supplementary_text and supplementary_text.strip():
        logger.info("Using Groq fallback for scanned document")
        return await analyze_report(supplementary_text)

    raise RuntimeError(
        "This appears to be a scanned/image document with no extractable text. "
        "Please upload a text-based PDF or DOCX for analysis."
    )
