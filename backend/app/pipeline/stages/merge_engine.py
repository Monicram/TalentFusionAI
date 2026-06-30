from datetime import datetime
from typing import Any, Dict, Optional

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage

SOURCE_PRIORITY = ["csv", "json", "resume", "linkedin", "github", "notes"]


class MergeEngineStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        merged = {}
        decisions = []

        for field, source_values in context.validated_data.items():
            non_null = {s: v for s, v in source_values.items() if v is not None}
            if not non_null:
                merged[field] = None
                decisions.append({
                    "field": field,
                    "values": source_values,
                    "winning_value": None,
                    "reason": "No non-null values across sources",
                    "confidence": 0.0,
                    "priority": "none",
                    "validation_result": "all_null",
                })
                continue

            if len(non_null) == 1:
                source, value = next(iter(non_null.items()))
                merged[field] = value
                decisions.append({
                    "field": field,
                    "values": source_values,
                    "winning_value": value,
                    "reason": "Only source with value",
                    "confidence": 0.8,
                    "priority": source,
                    "validation_result": "valid",
                })
                continue

            # Multiple values: use priority
            best_source = None
            best_value = None
            for source in SOURCE_PRIORITY:
                if source in non_null:
                    best_source = source
                    best_value = non_null[source]
                    break

            merged[field] = best_value
            decisions.append({
                "field": field,
                "values": source_values,
                "winning_value": best_value,
                "reason": f"Selected by priority: {best_source} has highest priority among sources",
                "confidence": 0.7,
                "priority": best_source,
                "validation_result": "valid",
            })

        context.merged_profile = merged
        context.merge_decisions = decisions
        context.logs.append({
            "agent": "merge_engine",
            "action": "merge",
            "status": "completed",
            "message": f"Merged {len(merged)} fields",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context
