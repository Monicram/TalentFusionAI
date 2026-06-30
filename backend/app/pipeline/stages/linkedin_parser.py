from datetime import datetime

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class LinkedInParserStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        raw = context.raw_sources.get("linkedin_url")
        if not raw:
            context.logs.append({
                "agent": "linkedin_parser",
                "action": "parse",
                "status": "skipped",
                "message": "No LinkedIn URL provided",
                "timestamp": datetime.utcnow().isoformat(),
            })
            return context

        data = context.raw_sources.get("linkedin_data", {})
        context.parsed_data["linkedin"] = data
        context.logs.append({
            "agent": "linkedin_parser",
            "action": "parse",
            "status": "completed",
            "message": f"Parsed LinkedIn fields: {list(data.keys())}",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context
