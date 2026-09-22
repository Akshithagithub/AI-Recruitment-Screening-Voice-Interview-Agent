from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


JobStatus = Literal["draft", "published", "unpublished"]


class JobPayload(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    department: str | None = Field(default=None, max_length=255)
    location: str | None = Field(default=None, max_length=255)
    employment_type: str | None = Field(default=None, max_length=50)
    experience_level: str | None = Field(default=None, max_length=50)
    openings: int = Field(default=1, ge=1)
    description: str | None = None
    responsibilities: str | None = None
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)
    education_requirements: str | None = None
    experience_requirements: str | None = None
    screening_config: dict[str, Any] = Field(default_factory=dict)
    interview_config: dict[str, Any] = Field(default_factory=dict)

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Title must not be blank")
        return value


class JobResponse(JobPayload):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: JobStatus
    public_application_url: str | None
    created_at: datetime
    updated_at: datetime


class MessageResponse(BaseModel):
    message: str
    
    
class ApplicationCreate(BaseModel):
    job_id: int
    candidate_name: str = Field(min_length=1, max_length=255)
    candidate_email: str = Field(min_length=1, max_length=255)
    phone: str | None = Field(default=None, max_length=50)
    resume_url: str | None = Field(default=None, max_length=2048)
    cover_letter: str | None = None

    @field_validator("candidate_name", "candidate_email")
    @classmethod
    def fields_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Field must not be blank")
        return value


class ApplicationResponse(ApplicationCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    created_at: datetime
    updated_at: datetime


class ExperienceItem(BaseModel):
    company: str | None = None
    role: str | None = None
    duration: str | None = None
    description: str | None = None


class EducationItem(BaseModel):
    institution: str | None = None
    degree: str | None = None
    field_of_study: str | None = None
    duration: str | None = None


class ProjectItem(BaseModel):
    name: str | None = None
    description: str | None = None
    technologies: list[str] = Field(default_factory=list)


class ResumeProfile(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None

    skills: list[str] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    projects: list[ProjectItem] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)