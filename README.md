# TalentFusion AI

A production-ready web application for **Candidate Profile Canonicalization** — transforming multi-source candidate data into one trusted, deterministic, explainable canonical profile.

---

## Overview

Recruiters receive candidate information from multiple sources:

- Resume (PDF/DOC)
- GitHub Profile
- LinkedIn Profile
- Recruiter CSV
- ATS JSON
- Recruiter Notes

These sources may contain **duplicate, conflicting, incomplete, or inconsistent** information. TalentFusion AI solves this challenge with:

- **Deterministic processing** — every step is reproducible
- **Explainable decisions** — why each value was selected
- **Full provenance** — trace every transformation back to its source
- **Modern recruiter dashboard** — beautiful, interactive UI

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| React Router | Routing |
| Framer Motion | Animations |
| Zustand | State management |
| Recharts | Charts & analytics |

### Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | Web framework |
| Python 3.11 | Language |
| SQLAlchemy | ORM |
| PostgreSQL | Database |
| Pydantic | Validation |
| Alembic | Migrations |

### Deployment

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Orchestration |
| Nginx | Reverse proxy |

---

## Quick Start

```bash
# Clone and start everything
docker compose up --build
```

Services will be available at:

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| API | http://localhost/api/v1 |
| Swagger Docs | http://localhost/api/docs |
| ReDoc | http://localhost/api/redoc |

---

## Architecture

```
Frontend (React + Vite)
        |
        v
    REST API (FastAPI)
        |
        v
    Controllers (Routers)
        |
        v
    Services (Business Logic)
        |
        v
    Pipeline Engine
        |
        v
    Agents (Parsers, Mappers, Validators)
        |
        v
    Repositories (SQLAlchemy)
        |
        v
    PostgreSQL
```

---

## Processing Pipeline

```
Upload Sources
      |
      v
Source Detection
      |
      v
Resume Parser  →  CSV Parser  →  GitHub Parser  →  LinkedIn Parser
      |              |               |                  |
      +--------------+---------------+------------------+
      |
      v
Canonical Mapping
      |
      v
Normalization
      |
      v
Validation
      |
      v
Merge Engine (priority-based)
      |
      v
Confidence Engine
      |
      v
Provenance Tracker
      |
      v
Projection Engine
      |
      v
Schema Validation
      |
      v
Final Canonical Profile
```

---

## Merge Strategy

Priority (highest to lowest):

1. Recruiter CSV
2. ATS JSON
3. Resume
4. LinkedIn
5. GitHub
6. Recruiter Notes

Rules:

- Choose the highest confidence value
- If confidence is equal, choose highest priority source
- Never invent missing values
- Unknown values become `null`

---

## Confidence Engine

Confidence for every field is calculated from:

- Source reliability
- Validation success
- Agreement across sources
- Normalization success
- Merge quality

An overall profile confidence score is also generated.

---

## Provenance Tracking

Every tracked field includes:

- Original value
- Normalized value
- Source
- Transformation method
- Timestamp
- Confidence

---

## Project Structure

```
.
├── src/                          # Frontend source
│   ├── App.tsx                   # App router
│   ├── main.tsx                  # Entry point
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   └── layout/               # AppLayout, Sidebar, TopNav
│   ├── pages/                    # All page components
│   ├── stores/                   # Zustand stores
│   └── lib/                      # API client, utilities
├── backend/                      # Backend source
│   ├── app/
│   │   ├── core/                 # Config, database
│   │   ├── models/               # SQLAlchemy models
│   │   ├── schemas/              # Pydantic schemas
│   │   ├── services/             # Business logic
│   │   ├── pipeline/             # Pipeline engine
│   │   │   ├── stages/           # Individual stages
│   │   │   └── pipeline.py       # Pipeline runner
│   │   └── api/                  # FastAPI routers
│   ├── main.py                   # FastAPI entry
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── Dockerfile
├── nginx/
│   └── default.conf
└── README.md
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/candidates/ | Create candidate |
| GET | /api/v1/candidates/ | List candidates |
| GET | /api/v1/candidates/{id} | Get candidate |
| POST | /api/v1/candidates/{id}/pipeline | Run pipeline |
| GET | /api/v1/candidates/{id}/logs | Get logs |
| POST | /api/v1/candidates/upload/resume | Upload resume |
| POST | /api/v1/candidates/upload/csv | Upload CSV |
| POST | /api/v1/candidates/upload/json | Upload JSON |
| GET | /api/v1/analytics/summary | Analytics summary |
| GET | /api/v1/health | Health check |

---

## Dashboard Pages

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/` | Stats, recent activity |
| Upload | `/upload` | Multi-source input + pipeline run |
| Candidates | `/candidates` | Table with search & sort |
| Pipeline | `/pipeline` | Animated pipeline execution |
| Source Comparison | `/comparison` | Side-by-side source values |
| Merge Decisions | `/merge` | Why each value was selected |
| Canonical Profile | `/canonical` | Final profile with download |
| Confidence | `/confidence` | Gauge charts, progress bars |
| Provenance | `/provenance` | Timeline of transformations |
| Logs | `/logs` | Structured execution logs |
| Analytics | `/analytics` | Charts & metrics |
| Settings | `/settings` | Pipeline configuration |

---

## Testing

### Backend (Pytest)

```bash
cd backend
pip install -r requirements.txt
pytest
```

### Frontend (Jest)

```bash
npm test
```

---

## Deployment

Single command deployment:

```bash
docker compose up --build
```

Components:
- React frontend (port 5173)
- FastAPI backend (port 8000)
- PostgreSQL (port 5432)
- Nginx reverse proxy (port 80)
- Swagger / ReDoc documentation

---

## License

MIT License
