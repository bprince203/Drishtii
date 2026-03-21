"""
LLM service: uses Groq (llama-3.3-70b) for text-based analysis and
Gemini Vision for image/scanned-PDF analysis.
"""

from __future__ import annotations

import json
import logging
import os

from models.schemas import ReportAnalysisResponse

logger = logging.getLogger(__name__)

_GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
_GROQ_API_KEY   = os.environ.get("GROQ_API_KEY", "")
_GEMINI_MODEL   = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
_GROQ_MODEL     = "llama-3.3-70b-versatile"


def _build_text_prompt(report_text: str) -> str:
    return (
        "You are a medical report analyzer. Analyze the following medical report and "
        "return a structured JSON response. The JSON must match this exact schema:\n\n"
        "{\n"
        '  "patientInfo": {"name": string|null, "age": string|null, "gender": string|null, "reportDate": string|null},\n'
        '  "reportType": string,\n'
        '  "summary": string,\n'
        '  "keyFindings": [{"parameter": string, "value": string, "unit": string|null, "status": "normal"|"high"|"low"|"critical"|"unknown", "interpretation": string}],\n'
        '  "abnormalFindings": [{"finding": string, "severity": "mild"|"moderate"|"severe", "recommendation": string}],\n'
        '  "recommendations": [string],\n'
        '  "disclaimer": string\n'
        "}\n\n"
        "IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.\n\n"
        f"Medical Report:\n{report_text}"
    )


async def analyze_report(report_text: str) -> ReportAnalysisResponse:
    """Analyze text-based report using Groq (fast, reliable)."""
    if not _GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured. Please set it in the .env file.")

    from groq import Groq
    client = Groq(api_key=_GROQ_API_KEY)

    try:
        completion = client.chat.completions.create(
            model=_GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a medical report analyzer. Always respond with valid JSON only."},
                {"role": "user",   "content": _build_text_prompt(report_text)},
            ],
            temperature=0.2,
            max_tokens=2000,
            response_format={"type": "json_object"},
        )
    except Exception as exc:
        logger.error("Groq API call failed: %s", str(exc))
        raise RuntimeError(f"AI analysis failed: {str(exc)}") from exc

    raw = completion.choices[0].message.content or "{}"
    try:
        parsed = json.loads(raw)
        # Add default disclaimer if missing
        if "disclaimer" not in parsed:
            parsed["disclaimer"] = "AI-generated summary for informational purposes only. Not a substitute for professional medical advice."
        return ReportAnalysisResponse(**parsed)
    except Exception as exc:
        logger.error("Failed to parse Groq response: %s", str(exc))
        raise RuntimeError("AI returned an unexpected response format.") from exc


async def analyze_report_with_images(
    images: list[bytes],
    supplementary_text: str | None = None,
) -> ReportAnalysisResponse:
    """
    Analyze scanned PDFs/images using Gemini Vision.
    Falls back to Groq text analysis if Gemini key is unavailable.
    """
    # Try Gemini Vision first
    if _GEMINI_API_KEY:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=_GEMINI_API_KEY)

            prompt_text = (
                "Analyze the following medical report image(s). "
                "Extract all medical data and provide a structured analysis. "
                "Read all text, tables, values, and medical information carefully."
            )
            if supplementary_text:
                prompt_text += f"\n\nAdditional extracted text:\n{supplementary_text}"

            parts: list[types.Part] = [types.Part.from_text(text=prompt_text)]
            for img_bytes in images:
                mime = "image/png"
                if img_bytes[:2] == b"\xff\xd8":
                    mime = "image/jpeg"
                parts.append(types.Part.from_bytes(data=img_bytes, mime_type=mime))

            response = await client.aio.models.generate_content(
                model=_GEMINI_MODEL,
                contents=parts,
                config={
                    "system_instruction": "You are a medical report analyzer. Return structured JSON only.",
                    "response_mime_type": "application/json",
                    "response_schema": ReportAnalysisResponse,
                    "temperature": 0.2,
                },
            )
            if response.parsed:
                return response.parsed
        except Exception as exc:
            logger.warning("Gemini Vision failed (%s), falling back to Groq text analysis", str(exc))

    # Fallback: use supplementary text with Groq if available
    if supplementary_text and supplementary_text.strip():
        logger.info("Falling back to Groq text analysis for scanned document")
        return await analyze_report(supplementary_text)

    raise RuntimeError(
        "This appears to be a scanned document. Gemini Vision is currently unavailable "
        "(API key may be invalid). Please upload a text-based PDF or DOCX instead."
    )
