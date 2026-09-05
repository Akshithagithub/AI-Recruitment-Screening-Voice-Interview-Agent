from collections.abc import Generator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import engine
from app.models import Job
from app.schemas import JobPayload, JobResponse, MessageResponse


router = APIRouter(prefix="/jobs", tags=["jobs"])




def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session



def database_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="The job service is temporarily unavailable.",
    )


@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobPayload, db: Session = Depends(get_db)) -> Job:
    job = Job(**payload.model_dump())
    try:
        db.add(job)
        db.commit()
        db.refresh(job)
        return job
    except SQLAlchemyError as error:
        db.rollback()
        raise database_error() from error


@router.get("", response_model=list[JobResponse])
def list_jobs(db: Session = Depends(get_db)) -> list[Job]:
    try:
        return list(db.scalars(select(Job).order_by(Job.created_at.desc())).all())
    except SQLAlchemyError as error:
        raise database_error() from error


def find_job(job_id: int, db: Session) -> Job:
    job = db.get(Job, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)) -> Job:
    try:
        return find_job(job_id, db)
    except SQLAlchemyError as error:
        raise database_error() from error


@router.put("/{job_id}", response_model=JobResponse)
def update_job(job_id: int, payload: JobPayload, db: Session = Depends(get_db)) -> Job:
    try:
        job = find_job(job_id, db)
        for key, value in payload.model_dump().items():
            setattr(job, key, value)
        db.commit()
        db.refresh(job)
        return job
    except SQLAlchemyError as error:
        db.rollback()
        raise database_error() from error


@router.delete("/{job_id}", response_model=MessageResponse)
def delete_job(job_id: int, db: Session = Depends(get_db)) -> MessageResponse:
    try:
        job = find_job(job_id, db)
        db.delete(job)
        db.commit()
        return MessageResponse(message="Job deleted")
    except SQLAlchemyError as error:
        db.rollback()
        raise database_error() from error


@router.patch("/{job_id}/publish", response_model=JobResponse)
def publish_job(job_id: int, db: Session = Depends(get_db)) -> Job:
    try:
        job = find_job(job_id, db)
        job.status = "published"
        job.public_application_url = f"/apply/{job.id}"
        db.commit()
        db.refresh(job)
        return job
    except SQLAlchemyError as error:
        db.rollback()
        raise database_error() from error