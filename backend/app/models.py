from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    department: Mapped[str | None] = mapped_column(String(255))
    location: Mapped[str | None] = mapped_column(String(255))
    employment_type: Mapped[str | None] = mapped_column(String(50))
    experience_level: Mapped[str | None] = mapped_column(String(50))
    openings: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    description: Mapped[str | None] = mapped_column(Text)
    responsibilities: Mapped[str | None] = mapped_column(Text)
    required_skills: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False, default=list)
    preferred_skills: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False, default=list)
    education_requirements: Mapped[str | None] = mapped_column(Text)
    experience_requirements: Mapped[str | None] = mapped_column(Text)

    screening_config: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    interview_config: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    status: Mapped[str] = mapped_column(String(20), nullable=False, default="draft")
    public_application_url: Mapped[str | None] = mapped_column(String(2048), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)