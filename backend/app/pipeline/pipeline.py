import time
from datetime import datetime

from app.pipeline.types import PipelineContext, PipelineStageData
from app.pipeline.stages.source_detection import SourceDetectionStage
from app.pipeline.stages.resume_parser import ResumeParserStage
from app.pipeline.stages.csv_parser import CsvParserStage
from app.pipeline.stages.github_parser import GithubParserStage
from app.pipeline.stages.linkedin_parser import LinkedInParserStage
from app.pipeline.stages.canonical_mapper import CanonicalMapperStage
from app.pipeline.stages.normalizer import NormalizerStage
from app.pipeline.stages.validator import ValidatorStage
from app.pipeline.stages.merge_engine import MergeEngineStage
from app.pipeline.stages.confidence_engine import ConfidenceEngineStage
from app.pipeline.stages.provenance_tracker import ProvenanceTrackerStage
from app.pipeline.stages.projection_engine import ProjectionEngineStage
from app.pipeline.stages.schema_validator import SchemaValidatorStage


class PipelineEngine:
    def __init__(self):
        self.stages = [
            ("source_detection", SourceDetectionStage()),
            ("resume_parser", ResumeParserStage()),
            ("csv_parser", CsvParserStage()),
            ("github_parser", GithubParserStage()),
            ("linkedin_parser", LinkedInParserStage()),
            ("canonical_mapper", CanonicalMapperStage()),
            ("normalizer", NormalizerStage()),
            ("validator", ValidatorStage()),
            ("merge_engine", MergeEngineStage()),
            ("confidence_engine", ConfidenceEngineStage()),
            ("provenance_tracker", ProvenanceTrackerStage()),
            ("projection_engine", ProjectionEngineStage()),
            ("schema_validator", SchemaValidatorStage()),
        ]

    def run(self, context: PipelineContext) -> PipelineContext:
        for stage_name, stage in self.stages:
            stage_data = PipelineStageData(name=stage_name)
            stage_data.start_time = datetime.utcnow()
            stage_data.status = "running"
            context.stages.append(stage_data)
            context.current_stage = len(context.stages) - 1

            try:
                start_ms = time.time() * 1000
                context = stage.execute(context)
                end_ms = time.time() * 1000
                stage_data.duration_ms = int(end_ms - start_ms)
                stage_data.status = "completed"
                stage_data.end_time = datetime.utcnow()
                stage_data.message = f"{stage_name} completed successfully"
            except Exception as e:
                stage_data.status = "failed"
                stage_data.end_time = datetime.utcnow()
                stage_data.message = str(e)
                context.logs.append({
                    "agent": stage_name,
                    "action": "execute",
                    "status": "failed",
                    "message": str(e),
                    "timestamp": datetime.utcnow().isoformat(),
                })
                break

        return context
