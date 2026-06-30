from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.candidate import (
    CandidateCreate,
    CandidateResponse,
    UploadResponse,
    PipelineRunResponse,
    PipelineLogResponse,
)
from app.services.candidate_service import CandidateService
from app.services.pipeline_service import PipelineService
from app.utils.extractor import extract_resume_text

router = APIRouter(prefix="/candidates", tags=["Candidates"])


@router.post("/", response_model=CandidateResponse)
def create_candidate(data: CandidateCreate, db: Session = Depends(get_db)):
    svc = CandidateService(db)
    return svc.create(data)


@router.get("/", response_model=List[CandidateResponse])
def list_candidates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    svc = CandidateService(db)
    return svc.list(skip=skip, limit=limit)


@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: str, db: Session = Depends(get_db)):
    svc = CandidateService(db)
    candidate = svc.get(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.patch("/{candidate_id}", response_model=CandidateResponse)
def update_candidate(candidate_id: str, data: CandidateCreate, db: Session = Depends(get_db)):
    svc = CandidateService(db)
    candidate = svc.get(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Merge raw sources if both exist
    if data.raw_sources:
        existing_sources = candidate.raw_sources or {}
        existing_sources.update(data.raw_sources)
        svc.update(candidate_id, {"raw_sources": existing_sources})
        
    return svc.get(candidate_id)


@router.post("/{candidate_id}/pipeline", response_model=PipelineRunResponse)
def run_pipeline(candidate_id: str, db: Session = Depends(get_db)):
    candidate_svc = CandidateService(db)
    candidate = candidate_svc.get(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    pipeline_svc = PipelineService(db)
    context = pipeline_svc.execute(candidate_id, candidate.raw_sources or {})

    # Update candidate with results
    candidate_svc.update(candidate_id, {
        "name": context.merged_profile.get("name"),
        "email": context.merged_profile.get("email"),
        "phone": context.merged_profile.get("phone"),
        "linkedin_url": context.merged_profile.get("linkedin_url"),
        "github_url": context.merged_profile.get("github_url"),
        "skills": context.merged_profile.get("skills", []),
        "experience": context.merged_profile.get("experience", []),
        "education": context.merged_profile.get("education", []),
        "certifications": context.merged_profile.get("certifications", []),
        "canonical_profile": context.final_profile,
        "confidence": context.confidence_scores,
        "overall_confidence": context.overall_confidence,
        "provenance": context.provenance,
        "merge_decisions": context.merge_decisions,
        "status": "completed" if all(s.status == "completed" for s in context.stages) else "partial",
    })

    return {
        "id": candidate_id,
        "candidate_id": candidate_id,
        "status": "completed" if all(s.status == "completed" for s in context.stages) else "partial",
        "stages": [s.model_dump() for s in context.stages],
        "started_at": context.stages[0].start_time if context.stages else None,
        "completed_at": context.stages[-1].end_time if context.stages else None,
        "duration_seconds": None,
    }


@router.get("/{candidate_id}/logs", response_model=List[PipelineLogResponse])
def get_candidate_logs(candidate_id: str, db: Session = Depends(get_db)):
    svc = PipelineService(db)
    return svc.get_logs(candidate_id=candidate_id)


@router.post("/upload/resume", response_model=UploadResponse)
def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):

    resume_text = extract_resume_text(file)
    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    candidate = CandidateService(db).create(
        CandidateCreate(
            raw_sources={
                "resume": {
                    "filename": file.filename,
                    "content": resume_text
                }
            }
        )
    )

    return UploadResponse(
        candidate_id=candidate.id,
        message="Resume uploaded successfully",
        status="success",
        detected_sources=["resume"],
    )

@router.post("/upload/csv", response_model=UploadResponse)
def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    import csv
    import io
    content = file.file.read().decode("utf-8")
    reader = csv.DictReader(io.StringIO(content))
    rows = list(reader)
    candidate = CandidateService(db).create(CandidateCreate(
        raw_sources={"csv": rows[0] if rows else {}},
    ))
    return UploadResponse(
        candidate_id=candidate.id,
        message="CSV uploaded successfully",
        status="success",
        detected_sources=["csv"],
    )


@router.post("/upload/json", response_model=UploadResponse)
def upload_json(data: Dict[str, Any], db: Session = Depends(get_db)):
    candidate = CandidateService(db).create(CandidateCreate(
        raw_sources={"json": data},
    ))
    return UploadResponse(
        candidate_id=candidate.id,
        message="JSON uploaded successfully",
        status="success",
        detected_sources=["json"],
    )
