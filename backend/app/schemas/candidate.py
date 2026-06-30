from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class CandidateCreate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    skills: Optional[List[str]] = []
    experience: Optional[List[Dict[str, Any]]] = []
    education: Optional[List[Dict[str, Any]]] = []
    certifications: Optional[List[str]] = []
    raw_sources: Optional[Dict[str, Any]] = {}


class CandidateResponse(BaseModel):
    id: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    skills: List[str] = []
    experience: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []
    certifications: List[str] = []
    canonical_profile: Dict[str, Any] = {}
    confidence: Dict[str, Any] = {}
    provenance: List[Dict[str, Any]] = []
    merge_decisions: List[Dict[str, Any]] = []
    overall_confidence: float = 0.0
    status: str = "pending"
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PipelineStage(BaseModel):
    name: str
    status: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_ms: Optional[int] = None
    message: Optional[str] = None


class PipelineRunResponse(BaseModel):
    id: str
    candidate_id: str
    status: str
    stages: List[PipelineStage] = []
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[float] = None

    class Config:
        from_attributes = True


class PipelineLogResponse(BaseModel):
    id: str
    candidate_id: Optional[str] = None
    pipeline_run_id: Optional[str] = None
    agent: str
    action: str
    status: str
    message: Optional[str] = None
    execution_time_ms: Optional[int] = None
    timestamp: datetime

    class Config:
        from_attributes = True


class UploadResponse(BaseModel):
    candidate_id: str
    message: str
    status: str
    detected_sources: List[str] = []


class SourceComparison(BaseModel):
    field: str
    values: Dict[str, Any]
    status: str
    resolved_value: Optional[Any] = None


class MergeDecision(BaseModel):
    field: str
    values: Dict[str, Any]
    winning_value: Optional[Any] = None
    reason: str
    confidence: float
    priority: str
    validation_result: str


class ConfidenceScore(BaseModel):
    field: str
    score: float
    source_reliability: float
    validation_success: float
    agreement: float
    normalization_success: float
    merge_quality: float


class ProvenanceEntry(BaseModel):
    field: str
    original_value: Any
    normalized_value: Any
    source: str
    transformation_method: str
    timestamp: datetime
    confidence: float


class AnalyticsSummary(BaseModel):
    total_candidates: int
    pipeline_success_rate: float
    average_confidence: float
    average_processing_time: float
    recent_candidates: List[CandidateResponse] = []
    recent_pipeline_runs: List[PipelineRunResponse] = []
    source_usage: Dict[str, int] = {}
    confidence_distribution: Dict[str, int] = {}
    pipeline_performance: Dict[str, float] = {}
