from datetime import datetime

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class GithubParserStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        raw = context.raw_sources.get("github_url")
        if not raw:
            context.logs.append({
                "agent": "github_parser",
                "action": "parse",
                "status": "skipped",
                "message": "No GitHub URL provided",
                "timestamp": datetime.utcnow().isoformat(),
            })
            return context

        data = context.raw_sources.get("github_data", {})
        context.parsed_data["github"] = data
        context.logs.append({
            "agent": "github_parser",
            "action": "parse",
            "status": "completed",
            "message": f"Parsed GitHub fields: {list(data.keys())}",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context
