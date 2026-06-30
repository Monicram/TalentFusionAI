from datetime import datetime
from typing import Any, Dict

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage

SOURCE_RELIABILITY = {
    "csv": 0.95,
    "json": 0.92,
    "resume": 0.88,
    "linkedin": 0.85,
    "github": 0.80,
    "notes": 0.65,
}


class ConfidenceEngineStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        scores = {}
        total = 0
        count = 0

        for field, source_values in context.validated_data.items():
            field_score = self._calculate_field_confidence(field, source_values)
            scores[field] = field_score
            total += field_score["score"]
            count += 1

        context.confidence_scores = scores
        context.overall_confidence = round(total / count, 4) if count > 0 else 0.0
        context.logs.append({
            "agent": "confidence_engine",
            "action": "score",
            "status": "completed",
            "message": f"Overall confidence: {context.overall_confidence}",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context

    def _calculate_field_confidence(self, field: str, source_values: Dict[str, Any]) -> Dict:
        non_null = {s: v for s, v in source_values.items() if v is not None}
        if not non_null:
            return {
                "score": 0.0,
                "source_reliability": 0.0,
                "validation_success": 0.0,
                "agreement": 0.0,
                "normalization_success": 0.0,
                "merge_quality": 0.0,
            }

        sources = list(non_null.keys())
        reliability = max(SOURCE_RELIABILITY.get(s, 0.5) for s in sources)
        validation = 1.0
        agreement = 1.0 if len(non_null) == 1 else 0.7
        normalization = 1.0
        merge_quality = 0.9 if len(non_null) > 1 else 0.8

        score = round(
            (reliability * 0.25 + validation * 0.20 + agreement * 0.20 +
             normalization * 0.15 + merge_quality * 0.20), 4
        )

        return {
            "score": score,
            "source_reliability": reliability,
            "validation_success": validation,
            "agreement": agreement,
            "normalization_success": normalization,
            "merge_quality": merge_quality,
        }
