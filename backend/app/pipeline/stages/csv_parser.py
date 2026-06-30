from datetime import datetime

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class CsvParserStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        raw = context.raw_sources.get("csv")
        if not raw:
            context.logs.append({
                "agent": "csv_parser",
                "action": "parse",
                "status": "skipped",
                "message": "No CSV data to parse",
                "timestamp": datetime.utcnow().isoformat(),
            })
            return context

        data = raw if isinstance(raw, dict) else {}
        context.parsed_data["csv"] = data
        context.logs.append({
            "agent": "csv_parser",
            "action": "parse",
            "status": "completed",
            "message": f"Parsed CSV fields: {list(data.keys())}",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context
