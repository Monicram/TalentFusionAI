from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.database import engine, Base
from app.api import candidates, analytics

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TalentFusion AI",
    version="1.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "service": "TalentFusion AI"}
