<div align="center">

# 🚀 TalentFusion AI

### AI-Powered Candidate Intelligence & Recruitment Automation Platform

Transform resumes into structured candidate profiles using an intelligent multi-stage AI pipeline with confidence scoring, validation, data normalization, and analytics.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)

</div>

---

# 📌 Overview

TalentFusion AI is an enterprise-grade recruitment intelligence platform that automatically extracts, validates, merges, and enriches candidate information from multiple sources.

Instead of simply parsing resumes, TalentFusion AI creates a unified candidate profile by processing information through a multi-stage AI pipeline that improves data quality, confidence, and consistency.

The system helps recruiters reduce manual effort while improving hiring decisions with structured candidate analytics.

---

# ✨ Features

## 📄 Intelligent Resume Parsing

- PDF Resume Processing
- DOCX Resume Processing
- Automatic Candidate Information Extraction
- Skill Detection
- Education Extraction
- Experience Detection
- Contact Information Parsing

---

## 🧠 AI Processing Pipeline

The candidate information passes through multiple intelligent stages:

- Source Detection
- Resume Parsing
- CSV Parsing
- LinkedIn Parsing
- GitHub Parsing
- Data Validation
- Schema Validation
- Data Normalization
- Canonical Mapping
- Merge Engine
- Confidence Engine
- Provenance Tracking
- Projection Engine

---

## 📊 Candidate Intelligence

- Candidate Summary
- Skills Analysis
- Education Timeline
- Work Experience
- Contact Details
- Confidence Score
- Candidate Analytics Dashboard

---

## 📈 Analytics Dashboard

- Total Candidates
- Skills Distribution
- Experience Analysis
- Education Statistics
- Candidate Confidence Metrics
- Recruitment Insights

---

# 🏗️ System Architecture

```
                Resume Upload
                      │
                      ▼
          Source Detection Stage
                      │
                      ▼
             Resume Parser
                      │
                      ▼
          Data Normalization
                      │
                      ▼
         Schema Validation
                      │
                      ▼
           Merge Engine
                      │
                      ▼
        Confidence Engine
                      │
                      ▼
      Provenance Tracking
                      │
                      ▼
      Unified Candidate Profile
                      │
                      ▼
         PostgreSQL Database
                      │
                      ▼
      React Analytics Dashboard
```

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

---

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

---

## Database

- PostgreSQL

---

## DevOps

- Docker
- Docker Compose
- Nginx

---

## Document Processing

- pdfplumber
- python-docx

---

# 📂 Project Structure

```
TalentFusion AI
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── models
│   │   ├── pipeline
│   │   ├── schemas
│   │   ├── services
│   │   └── utils
│   │
│   ├── requirements.txt
│   └── main.py
│
├── src
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   └── styles
│
├── nginx
│
├── docker-compose.yml
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/TalentFusion-AI.git

cd TalentFusion-AI
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs at

```
http://localhost:8000
```

---

## Frontend Setup

```bash
npm install

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 🐳 Docker Deployment

Run the complete application using Docker.

```bash
docker compose up --build
```

Services

- Frontend
- Backend
- PostgreSQL
- Nginx

---

# 📦 API Endpoints

## Candidate APIs

| Method | Endpoint | Description |
|----------|--------------------|-----------------------------|
| POST | `/api/candidates/upload` | Upload Resume |
| GET | `/api/candidates` | Get Candidates |
| GET | `/api/candidates/{id}` | Get Candidate |
| DELETE | `/api/candidates/{id}` | Delete Candidate |

---

## Analytics APIs

| Method | Endpoint | Description |
|----------|--------------------|-----------------------------|
| GET | `/api/analytics` | Dashboard Analytics |
| GET | `/api/analytics/skills` | Skills Analytics |
| GET | `/api/analytics/experience` | Experience Statistics |

---

# 📸 Screenshots

## Dashboard

> Add screenshot here

```
/screenshots/dashboard.png
```

---

## Candidate Profile

> Add screenshot here

```
/screenshots/profile.png
```

---

## Resume Upload

> Add screenshot here

```
/screenshots/upload.png
```

---

## Analytics

> Add screenshot here

```
/screenshots/analytics.png
```

---

# 🚀 Future Enhancements

- AI Resume Ranking
- Semantic Candidate Search
- Job Description Matching
- Resume Recommendation Engine
- LLM-Based Candidate Summary
- Interview Question Generator
- Email Notifications
- HR Management Dashboard
- Multi-user Authentication
- Cloud Deployment

---

# 🎯 Key Highlights

- Multi-Stage AI Processing Pipeline
- Intelligent Resume Parsing
- Confidence Score Generation
- Candidate Analytics Dashboard
- Enterprise Architecture
- Dockerized Deployment
- FastAPI REST APIs
- React + TypeScript Frontend
- PostgreSQL Database

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---


# 👩‍💻 Author

**Monica R**

Computer Science Engineering Student

AI • Machine Learning • Full Stack Development

GitHub: https://github.com/Monicram

---

<div align="center">

### ⭐ If you found this project useful, don't forget to star the repository!

Made with ❤️ using FastAPI, React, TypeScript and PostgreSQL

</div>
