from typing import Any, Dict
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.candidate import PipelineRun, PipelineLog
from app.pipeline.pipeline import PipelineEngine
from app.pipeline.types import PipelineContext


class PipelineService:
    def __init__(self, db: Session):
        self.db = db

    def execute(self, candidate_id: str, raw_sources: Dict[str, Any]) -> PipelineContext:
        engine = PipelineEngine()
        context = PipelineContext(candidate_id=candidate_id, raw_sources=raw_sources)

        pipeline_run = PipelineRun(
            candidate_id=candidate_id,
            status="running",
        )
        self.db.add(pipeline_run)
        self.db.commit()

        try:
            context = engine.run(context)
            if any(s.status == "failed" for s in context.stages):
                status = "failed"
            elif all(s.status == "completed" for s in context.stages):
                status = "completed"
            else:
                status = "partial"
            pipeline_run.status = status
        except Exception as e:
            pipeline_run.status = "failed"
            context.logs.append({
                "agent": "pipeline",
                "action": "execute",
                "status": "failed",
                "message": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            })

        pipeline_run.completed_at = datetime.utcnow()
        if pipeline_run.started_at:
            delta = (pipeline_run.completed_at - pipeline_run.started_at).total_seconds()
            pipeline_run.duration_seconds = delta

        for log in context.logs:
            self.db.add(PipelineLog(
                candidate_id=candidate_id,
                pipeline_run_id=pipeline_run.id,
                agent=log.get("agent", "unknown"),
                action=log.get("action", "unknown"),
                status=log.get("status", "unknown"),
                message=log.get("message", ""),
            ))

        self.db.commit()
        return context

    def get_logs(self, candidate_id: str = None, limit: int = 100) -> list:
        q = self.db.query(PipelineLog)
        if candidate_id:
            q = q.filter(PipelineLog.candidate_id == candidate_id)
        return q.order_by(PipelineLog.timestamp.desc()).limit(limit).all()

    def get_runs(self, candidate_id: str = None, limit: int = 100) -> list:
        q = self.db.query(PipelineRun)
        if candidate_id:
            q = q.filter(PipelineRun.candidate_id == candidate_id)
        return q.order_by(PipelineRun.started_at.desc()).limit(limit).all()
