from datetime import datetime
import re

from app.pipeline.types import PipelineContext
from app.pipeline.stages.base import PipelineStage


class ResumeParserStage(PipelineStage):

    def execute(self, context: PipelineContext) -> PipelineContext:

        raw = context.raw_sources.get("resume")

        if not raw:
            context.logs.append({
                "agent": "resume_parser",
                "action": "parse",
                "status": "skipped",
                "message": "Resume source not found",
                "timestamp": datetime.utcnow().isoformat(),
            })
            return context

        text = ""

        if isinstance(raw, dict):
            text = raw.get("content", "")

        if not text:
            context.logs.append({
                "agent": "resume_parser",
                "action": "parse",
                "status": "failed",
                "message": "Resume content is empty",
                "timestamp": datetime.utcnow().isoformat(),
            })
            return context

        email = None
        phone = None
        name = None
        github_url = None
        linkedin_url = None

        email_match = re.search(
            r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
            text,
        )
        if email_match:
            email = email_match.group()

        phone_match = re.search(
            r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}",
            text,
        )
        if phone_match:
            phone = phone_match.group()

        linkedin_match = re.search(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+", text)
        if linkedin_match:
            linkedin_url = linkedin_match.group()

        github_match = re.search(r"(?:https?://)?(?:www\.)?github\.com/[a-zA-Z0-9_-]+", text)
        if github_match:
            github_url = github_match.group()

        lines = [line.strip() for line in text.splitlines() if line.strip()]

        if lines:
            # Simple heuristic: Name is often the first line or within the first few lines
            name = lines[0]
            if len(name) > 50 or "resume" in name.lower() or "cv" in name.lower():
                if len(lines) > 1:
                    name = lines[1]

        skills = []
        skill_keywords = [
            "Python", "Java", "C", "C++", "SQL", "JavaScript", "React", "Node", "Flask", "FastAPI",
            "Docker", "Kubernetes", "Git", "TensorFlow", "PyTorch", "Machine Learning", "MongoDB",
            "MySQL", "HTML", "CSS", "AWS", "GCP", "Azure", "TypeScript", "Next.js", "Django",
            "PostgreSQL", "Redis", "Kafka", "Linux", "Bash", "GraphQL", "REST API"
        ]

        lower_text = text.lower()
        for skill in skill_keywords:
            # Word boundary regex to avoid partial matches
            if re.search(rf"\b{re.escape(skill.lower())}\b", lower_text):
                skills.append(skill)

        # Basic Section Extraction
        experience = []
        education = []
        certifications = []
        
        current_section = None
        
        for line in lines:
            line_lower = line.lower()
            if "experience" in line_lower and len(line) < 20:
                current_section = "experience"
                continue
            elif "education" in line_lower and len(line) < 20:
                current_section = "education"
                continue
            elif ("certification" in line_lower or "certificates" in line_lower) and len(line) < 20:
                current_section = "certifications"
                continue
            elif "skills" in line_lower and len(line) < 20:
                current_section = "skills"
                continue
            elif "projects" in line_lower and len(line) < 20:
                current_section = "projects"
                continue
                
            if current_section == "experience" and len(line) > 10:
                # Naive chunking
                if not experience or len(experience[-1].get("description", "")) > 200:
                    experience.append({"title": line, "company": "", "description": ""})
                else:
                    experience[-1]["description"] += line + " "
                    
            elif current_section == "education" and len(line) > 10:
                if not education or len(education[-1].get("degree", "")) > 100:
                    education.append({"degree": line, "institution": ""})
                else:
                    education[-1]["institution"] += line + " "
                    
            elif current_section == "certifications" and len(line) > 10:
                certifications.append(line)

        # Clean up
        for exp in experience:
            exp["description"] = exp["description"].strip()
        for edu in education:
            edu["institution"] = edu["institution"].strip()

        context.parsed_data["resume"] = {
            "name": name,
            "email": email,
            "phone": phone,
            "linkedin_url": linkedin_url,
            "github_url": github_url,
            "skills": list(set(skills)),
            "experience": experience,
            "education": education,
            "certifications": certifications,
        }

        context.logs.append({
            "agent": "resume_parser",
            "action": "parse",
            "status": "completed",
            "message": f"Parsed resume successfully. Found {len(skills)} skills, {len(experience)} experiences.",
            "timestamp": datetime.utcnow().isoformat(),
        })

        return context