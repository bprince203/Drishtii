"""
Pydantic v2 schemas for Medical Report Analyzer API responses.
These models are the single source of truth for the shape of data
that flows from the LLM through FastAPI back to the Express proxy.
"""

from __future__ import annotations

from typing import List, Literal, Optional

from pydantic import BaseModel


class Issue(BaseModel):
    name: str
    description: str
    severity: Literal["low", "moderate", "high"]
    possible_causes: List[str]
    what_it_means: str


class Medication(BaseModel):
    name: str
    purpose: str
    dosage_noted: str
    common_side_effects: List[str]
    important_notes: str


class VitalSign(BaseModel):
    name: str
    value: str
    normal_range: str
    status: Literal["normal", "borderline", "abnormal"]


class ReportAnalysisResponse(BaseModel):
    patient_overview: str
    summary: str
    key_findings: List[str]
    vital_signs: List[VitalSign]
    issues: List[Issue]
    medications: List[Medication]
    lifestyle_advice: List[str]
    follow_up_actions: List[str]
    risk_level: Literal["low", "moderate", "high"]
    disclaimer: str
