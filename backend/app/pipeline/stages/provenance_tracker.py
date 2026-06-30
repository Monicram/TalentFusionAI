from datetime import datetime
from typing import Any, Dict

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class ProvenanceTrackerStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        provenance = []

        for field, source_values in context.validated_data.items():
            for source, normalized in source_values.items():
                raw = context.canonical_map.get(field, {}).get(source, None)
                confidence = context.confidence_scores.get(field, {}).get("score", 0.0)
                provenance.append({
                    "field": field,
                    "original_value": raw,
                    "normalized_value": normalized,
                    "source": source,
                    "transformation_method": "normalization",
                    "timestamp": datetime.utcnow().isoformat(),
                    "confidence": confidence,
                })

        context.provenance = provenance
        context.logs.append({
            "agent": "provenance_tracker",
            "action": "track",
            "status": "completed",
            "message": f"Tracked {len(provenance)} provenance entries",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context
