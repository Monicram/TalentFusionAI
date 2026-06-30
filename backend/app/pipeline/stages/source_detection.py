import re
from datetime import datetime
from typing import Any

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class SourceDetectionStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        raw = context.raw_sources
        detected = []

        if raw.get("resume"):
            detected.append("resume")
        if raw.get("csv"):
            detected.append("csv")
        if raw.get("json"):
            detected.append("json")
        if raw.get("github_url"):
            detected.append("github")
        if raw.get("linkedin_url"):
            detected.append("linkedin")
        if raw.get("notes"):
            detected.append("notes")

        context.detected_sources = detected
        context.logs.append({
            "agent": "source_detection",
            "action": "detect_sources",
            "status": "completed",
            "message": f"Detected sources: {', '.join(detected)}",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context
