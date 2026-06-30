from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.candidate import Candidate, PipelineRun


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def summary(self) -> dict:
        total = self.db.query(func.count(Candidate.id)).scalar() or 0
        success = self.db.query(func.count(PipelineRun.id)).filter(PipelineRun.status == "completed").scalar() or 0
        total_runs = self.db.query(func.count(PipelineRun.id)).scalar() or 1
        success_rate = round(success / total_runs * 100, 2)

        avg_confidence = self.db.query(func.avg(Candidate.overall_confidence)).scalar() or 0.0
        avg_confidence = round(avg_confidence, 4)

        avg_time = self.db.query(func.avg(PipelineRun.duration_seconds)).scalar() or 0.0
        avg_time = round(avg_time, 2)

        recent_candidates = self.db.query(Candidate).order_by(Candidate.created_at.desc()).limit(5).all()
        recent_runs = self.db.query(PipelineRun).order_by(PipelineRun.started_at.desc()).limit(5).all()

        return {
            "total_candidates": total,
            "pipeline_success_rate": success_rate,
            "average_confidence": avg_confidence,
            "average_processing_time": avg_time,
            "recent_candidates": recent_candidates,
            "recent_pipeline_runs": recent_runs,
            "source_usage": {},
            "confidence_distribution": {},
            "pipeline_performance": {},
        }
