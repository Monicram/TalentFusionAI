from datetime import datetime

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class ProjectionEngineStage(PipelineStage):
    def execute(self, context: PipelineContext) -> PipelineContext:
        profile = {
            "personal": {
                "name": context.merged_profile.get("name"),
                "email": context.merged_profile.get("email"),
                "phone": context.merged_profile.get("phone"),
            },
            "contact": {
                "linkedin_url": context.merged_profile.get("linkedin_url"),
                "github_url": context.merged_profile.get("github_url"),
            },
            "skills": context.merged_profile.get("skills", []),
            "experience": context.merged_profile.get("experience", []),
            "education": context.merged_profile.get("education", []),
            "certifications": context.merged_profile.get("certifications", []),
            "confidence": {
                "overall": context.overall_confidence,
                "by_field": context.confidence_scores,
            },
            "provenance": context.provenance,
            "merge_decisions": context.merge_decisions,
        }

        context.final_profile = profile
        context.logs.append({
            "agent": "projection_engine",
            "action": "project",
            "status": "completed",
            "message": "Profile projection completed",
            "timestamp": datetime.utcnow().isoformat(),
        })
        return context
