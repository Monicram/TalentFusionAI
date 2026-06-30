from datetime import datetime
from typing import Any, Dict

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage

CANONICAL_FIELDS = [
    "name",
    "email",
    "phone",
    "linkedin_url",
    "github_url",
    "skills",
    "experience",
    "education",
    "certifications",
]

FIELD_ALIASES = {
    "name": ["name", "full_name", "candidate_name"],
    "email": ["email", "email_address", "contact_email"],
    "phone": ["phone", "phone_number", "contact_phone"],
    "linkedin_url": ["linkedin_url", "linkedin", "linkedin_profile"],
    "github_url": ["github_url", "github", "github_profile"],
    "skills": ["skills", "skill_set", "technologies"],
    "experience": ["experience", "work_experience", "employment_history"],
    "education": ["education", "academic_background", "degrees"],
    "certifications": ["certifications", "certs", "certificates"],
}


class CanonicalMapperStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        canonical = {}
        for source_name, data in context.parsed_data.items():
            for canonical_field, aliases in FIELD_ALIASES.items():
                for alias in aliases:
                    if alias in data and data[alias] is not None:
                        if canonical_field not in canonical:
                            canonical[canonical_field] = {}
                        canonical[canonical_field][source_name] = data[alias]
                        break

        context.canonical_map = canonical
        context.logs.append({
            "agent": "canonical_mapper",
            "action": "map",
            "status": "completed",
            "message": f"Mapped {len(canonical)} canonical fields",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context
