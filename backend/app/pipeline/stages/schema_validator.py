from datetime import datetime

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class SchemaValidatorStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        final = context.final_profile
        errors = []

        if not final.get("personal", {}).get("name"):
            errors.append("Missing required field: name")
        if not final.get("personal", {}).get("email"):
            errors.append("Missing required field: email")

        if errors:
            context.logs.append({
                "agent": "schema_validator",
                "action": "validate",
                "status": "warning",
                "message": "; ".join(errors),
                "timestamp": datetime.utcnow().isoformat(),
            })
        else:
            context.logs.append({
                "agent": "schema_validator",
                "action": "validate",
                "status": "completed",
                "message": "Schema validation passed",
                "timestamp": datetime.utcnow().isoformat(),
            })

        return context
