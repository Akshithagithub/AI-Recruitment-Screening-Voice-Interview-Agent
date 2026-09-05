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