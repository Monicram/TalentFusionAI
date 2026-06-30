from datetime import datetime
from typing import Any, Dict, List

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class NormalizerStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        normalized = {}
        for field, source_values in context.canonical_map.items():
            normalized[field] = {}
            for source, value in source_values.items():
                normalized[field][source] = self._normalize(field, value)

        context.normalized_data = normalized
        context.logs.append({
            "agent": "normalizer",
            "action": "normalize",
            "status": "completed",
            "message": f"Normalized {len(normalized)} fields",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context

    def _normalize(self, field: str, value: Any) -> Any:
        if value is None:
            return None
        if field in ("name", "email", "phone"):
            return str(value).strip().lower() if field == "email" else str(value).strip()
        if field == "skills":
            if isinstance(value, str):
                return [s.strip() for s in value.split(",") if s.strip()]
            if isinstance(value, list):
                return [str(s).strip() for s in value if s]
            return [str(value)]
        if field in ("experience", "education"):
            if isinstance(value, list):
                return value
            if isinstance(value, dict):
                return [value]
            return []
        return value
