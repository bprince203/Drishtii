"""
Smart multi-strategy document text/image extractor.
Supports: text-based PDF, scanned/image PDF (renders to images for Gemini Vision),
           JPG/PNG/WEBP (pass directly to Gemini Vision), DOCX.
Operates entirely in memory — no files written to disk.
"""

from __future__ import annotations

import io
import logging
import os
import re
from dataclasses import dataclass

import fitz  # PyMuPDF

logger = logging.getLogger(__name__)

_MAX_CHARS = 12_000  # LLM context safety limit


@dataclass
class ExtractionResult:
    """Result of document extraction — either text, images, or both."""
    text: str | None = None
    images: list[bytes] | None = None
    mode: str = "text"  # "text" | "vision" | "mixed"


def _normalize_text(text: str) -> str:
    """Strip excessive whitespace, junk lines, and truncate."""
    lines = text.splitlines()
    cleaned_lines = [
        line for line in lines
        if not re.fullmatch(r"[^a-zA-Z0-9]*", line)
    ]
    text = "\n".join(cleaned_lines)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text).strip()
    if len(text) > _MAX_CHARS:
        text = text[:_MAX_CHARS] + "\n\n[... truncated for analysis ...]"
    return text


def _extract_pdf(file_bytes: bytes) -> ExtractionResult:
    """
    Extract from PDF:
    - If text-rich: return text
    - If scanned/image-heavy: render pages to PNG for Gemini Vision
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception as exc:
        raise ValueError(f"Could not open file as a valid PDF: {exc}") from exc

    # Try native text extraction first
    pages_text: list[str] = []
    for page in doc:
        pages_text.append(page.get_text())

    raw_text = "\n".join(pages_text)
    cleaned = _normalize_text(raw_text)

    # If we got enough text, use text mode
    if len(cleaned) >= 100:
        doc.close()
        return ExtractionResult(text=cleaned, mode="text")

    # Otherwise it's a scanned/image PDF — render pages to images for Gemini Vision
    logger.info("PDF has minimal text (%d chars), rendering pages to images for Vision", len(cleaned))
    images: list[bytes] = []
    for page_num in range(min(len(doc), 10)):  # Cap at 10 pages
        page = doc[page_num]
        mat = fitz.Matrix(2, 2)  # 200 DPI — good balance of quality vs size
        pix = page.get_pixmap(matrix=mat)
        images.append(pix.tobytes("png"))

    doc.close()

    if not images:
        raise ValueError("No readable content found in this PDF.")

    return ExtractionResult(images=images, mode="vision")


def _extract_image(file_bytes: bytes) -> ExtractionResult:
    """Pass image directly to Gemini Vision — no OCR needed."""
    return ExtractionResult(images=[file_bytes], mode="vision")


def _extract_docx(file_bytes: bytes) -> ExtractionResult:
    """Extract text from a DOCX file using python-docx."""
    try:
        from docx import Document
    except ImportError as exc:
        raise RuntimeError("python-docx is not installed for DOCX support.") from exc

    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    text = "\n".join(paragraphs)

    if not text.strip():
        raise ValueError("DOCX has no readable content.")

    return ExtractionResult(text=_normalize_text(text), mode="text")


def _detect_file_type(file_bytes: bytes, filename: str) -> str:
    """Detect file type via extension and magic bytes."""
    ext = os.path.splitext(filename.lower())[-1]

    ext_map = {
        ".pdf": "pdf",
        ".jpg": "image", ".jpeg": "image",
        ".png": "image", ".webp": "image",
        ".docx": "docx", ".doc": "docx",
    }

    if ext in ext_map:
        return ext_map[ext]

    # Magic bytes fallback
    if file_bytes[:4] == b"%PDF":
        return "pdf"
    if file_bytes[:8] == b"\x89PNG\r\n\x1a\n":
        return "image"
    if file_bytes[:2] == b"\xff\xd8":
        return "image"
    if file_bytes[:4] == b"PK\x03\x04":
        return "docx"

    return "unknown"


def extract(file_bytes: bytes, filename: str) -> ExtractionResult:
    """
    Smart extraction pipeline: detects file type and returns either
    extracted text or raw image bytes for Gemini Vision processing.

    Args:
        file_bytes: Raw bytes of the uploaded file.
        filename:   Original filename for type detection.

    Returns:
        ExtractionResult with text and/or images.

    Raises:
        ValueError: If unsupported type or no content extractable.
    """
    file_type = _detect_file_type(file_bytes, filename)

    if file_type == "pdf":
        return _extract_pdf(file_bytes)
    elif file_type == "image":
        return _extract_image(file_bytes)
    elif file_type == "docx":
        return _extract_docx(file_bytes)
    else:
        raise ValueError(
            "Unsupported file type. Accepted formats: PDF, JPG, PNG, WEBP, DOCX"
        )
