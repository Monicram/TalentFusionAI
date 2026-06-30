import re
from datetime import datetime
from typing import Any

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class ValidatorStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        validated = {}
        validation_results = {}

        for field, source_values in context.normalized_data.items():
            validated[field] = {}
            validation_results[field] = {}
            for source, value in source_values.items():
                is_valid, message = self._validate(field, value)
                validated[field][source] = value if is_valid else None
                validation_results[field][source] = {
                    "valid": is_valid,
                    "message": message,
                }

        context.validated_data = validated
        context.logs.append({
            "agent": "validator",
            "action": "validate",
            "status": "completed",
            "message": "Validation completed",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context

    def _validate(self, field: str, value: Any) -> tuple:
        if value is None:
            return True, "null value"
        if field == "email":
            pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
            if re.match(pattern, str(value)):
                return True, "valid email"
            return False, "invalid email format"
        if field == "phone":
            digits = re.sub(r"\D", "", str(value))
            if len(digits) >= 10:
                return True, "valid phone"
            return False, "invalid phone number"
        if field == "name":
            if len(str(value).strip()) >= 2:
                return True, "valid name"
            return False, "name too short"
        return True, "no specific validation"
