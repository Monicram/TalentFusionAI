from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class PipelineStageData(BaseModel):
    name: str
    status: str = "pending"
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_ms: Optional[int] = None
    message: Optional[str] = None
    result: Optional[Any] = None


class PipelineContext(BaseModel):
    candidate_id: str
    raw_sources: Dict[str, Any] = {}
    detected_sources: List[str] = []
    parsed_data: Dict[str, Any] = {}
    canonical_map: Dict[str, Any] = {}
    normalized_data: Dict[str, Any] = {}
    validated_data: Dict[str, Any] = {}
    merged_profile: Dict[str, Any] = {}
    confidence_scores: Dict[str, Any] = {}
    overall_confidence: float = 0.0
    provenance: List[Dict[str, Any]] = []
    merge_decisions: List[Dict[str, Any]] = []
    final_profile: Dict[str, Any] = {}
    stages: List[PipelineStageData] = []
    current_stage: int = 0
    logs: List[Dict[str, Any]] = []

    class Config:
        arbitrary_types_allowed = True
