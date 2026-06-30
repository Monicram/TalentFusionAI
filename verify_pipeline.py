import os
import sys

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

# Set SQLite DB to avoid Postgres connection failure during testing
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from app.core.database import Base, engine
from app.services.candidate_service import CandidateService
from app.schemas.candidate import CandidateCreate
from app.pipeline.pipeline import PipelineEngine
from app.pipeline.types import PipelineContext

def test_pipeline():
    print("Testing Pipeline Initialization...")
    Base.metadata.create_all(bind=engine)
    
    # Mock some raw resume data
    raw_sources = {
        "resume": {
            "filename": "sample.pdf",
            "content": "John Doe\njohndoe@email.com\n+1234567890\n\nExperience\nSoftware Engineer at TechCorp. Built an AI platform.\n\nEducation\nB.S. Computer Science\n\nSkills\nPython, React, Docker"
        }
    }
    
    print("Testing Pipeline Execution...")
    engine_pipeline = PipelineEngine()
    context = PipelineContext(candidate_id="test-123", raw_sources=raw_sources)
    context = engine_pipeline.run(context)
    
    print(f"Pipeline finished with {len(context.stages)} stages executed.")
    for stage in context.stages:
        print(f" - {stage.name}: {stage.status} ({stage.duration_ms}ms)")
        
    print("\nParsed Data Summary:")
    resume_parsed = context.parsed_data.get("resume", {})
    print(f"Name: {resume_parsed.get('name')}")
    print(f"Email: {resume_parsed.get('email')}")
    print(f"Phone: {resume_parsed.get('phone')}")
    print(f"Skills: {resume_parsed.get('skills')}")
    print(f"Experience: {resume_parsed.get('experience')}")
    print(f"Education: {resume_parsed.get('education')}")

    print("\nValidation Successful: ✅ No runtime errors during parsing logic.")

if __name__ == "__main__":
    test_pipeline()
