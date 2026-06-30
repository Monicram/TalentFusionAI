import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, JSON, Integer, Text

from app.core.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    skills = Column(JSON, default=list)
    experience = Column(JSON, default=list)
    education = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    raw_sources = Column(JSON, default=dict)
    canonical_profile = Column(JSON, default=dict)
    confidence = Column(JSON, default=dict)
    provenance = Column(JSON, default=list)
    merge_decisions = Column(JSON, default=list)
    overall_confidence = Column(Float, default=0.0)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PipelineRun(Base):
    __tablename__ = "pipeline_runs"

    id = Column(String, primary_key=True, default=gen_uuid)
    candidate_id = Column(String, nullable=False)
    status = Column(String, default="pending")
    stages = Column(JSON, default=list)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Float, nullable=True)


class PipelineLog(Base):
    __tablename__ = "pipeline_logs"

    id = Column(String, primary_key=True, default=gen_uuid)
    candidate_id = Column(String, nullable=True)
    pipeline_run_id = Column(String, nullable=True)
    agent = Column(String, nullable=False)
    action = Column(String, nullable=False)
    status = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    execution_time_ms = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
