from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from app.models.candidate import Candidate
from app.schemas.candidate import CandidateCreate, CandidateResponse


class CandidateService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: CandidateCreate) -> Candidate:
        candidate = Candidate(
            name=data.name,
            email=data.email,
            phone=data.phone,
            linkedin_url=data.linkedin_url,
            github_url=data.github_url,
            skills=data.skills or [],
            experience=data.experience or [],
            education=data.education or [],
            certifications=data.certifications or [],
            raw_sources=data.raw_sources or {},
        )
        self.db.add(candidate)
        self.db.commit()
        self.db.refresh(candidate)
        return candidate

    def get(self, candidate_id: str) -> Optional[Candidate]:
        return self.db.query(Candidate).filter(Candidate.id == candidate_id).first()

    def list(self, skip: int = 0, limit: int = 100) -> List[Candidate]:
        return self.db.query(Candidate).order_by(Candidate.created_at.desc()).offset(skip).limit(limit).all()

    def update(self, candidate_id: str, data: Dict[str, Any]) -> Optional[Candidate]:
        candidate = self.get(candidate_id)
        if not candidate:
            return None
        for key, value in data.items():
            if hasattr(candidate, key):
                setattr(candidate, key, value)
        self.db.commit()
        self.db.refresh(candidate)
        return candidate

    def delete(self, candidate_id: str) -> bool:
        candidate = self.get(candidate_id)
        if not candidate:
            return False
        self.db.delete(candidate)
        self.db.commit()
        return True
