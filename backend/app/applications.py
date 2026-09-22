from collections.abc import Generator
from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from app.services.resume_pipeline import process_resume
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import engine
from app.models import Application, Job
from app.schemas import ApplicationResponse
from app.services.resume_extractor import (
    ResumeExtractionError,
    extract_resume_text,
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


# Resume storage directory
BASE_DIR = Path(__file__).resolve().parents[2]
RESUME_DIR = BASE_DIR / "uploads" / "resumes"
RESUME_DIR.mkdir(parents=True, exist_ok=True)

# Maximum resume size: 5 MB
MAX_RESUME_SIZE = 5 * 1024 * 1024

ALLOWED_EXTENSIONS = {".pdf", ".docx"}

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_application(
    background_tasks: BackgroundTasks,
    job_id: int = Form(...),
    candidate_name: str = Form(...),
    candidate_email: str = Form(...),
    phone: str | None = Form(None),
    cover_letter: str | None = Form(None),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> Application:

    # -----------------------------
    # Validate text fields
    # -----------------------------

    candidate_name = candidate_name.strip()
    candidate_email = candidate_email.strip()

    if not candidate_name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Candidate name must not be blank",
        )

    if not candidate_email:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Candidate email must not be blank",
        )

    # -----------------------------
    # Validate job
    # -----------------------------

    job = db.get(Job, job_id)

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    if job.status != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Applications are only allowed for published jobs",
        )

    # -----------------------------
    # Validate resume
    # -----------------------------

    if not resume.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume file is required",
        )

    extension = Path(resume.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX resumes are allowed",
        )

    if resume.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid resume file type",
        )

    # -----------------------------
    # Read and validate file size
    # -----------------------------

    resume_content = await resume.read()

    if len(resume_content) > MAX_RESUME_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Resume file must be 5 MB or smaller",
        )

    if len(resume_content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume file cannot be empty",
        )

    # -----------------------------
    # Save resume
    # -----------------------------

    stored_filename = f"{uuid4().hex}{extension}"
    resume_path = RESUME_DIR / stored_filename

    try:
        resume_path.write_bytes(resume_content)

        # -----------------------------
        # Create application
        # -----------------------------

        application = Application(
            job_id=job_id,
            candidate_name=candidate_name,
            candidate_email=candidate_email,
            phone=phone,
            resume_url=str(resume_path),
            cover_letter=cover_letter,
            status="submitted",
        )

        db.add(application)
        db.commit()
        db.refresh(application)

        return application

    except SQLAlchemyError as error:
        db.rollback()

        # Remove uploaded file if database operation fails
        if resume_path.exists():
            resume_path.unlink()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        ) from error

    except OSError as error:
        db.rollback()

        if resume_path.exists():
            resume_path.unlink()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save resume",
        ) from error


@router.get(
    "",
    response_model=list[ApplicationResponse],
)
def get_applications(
    db: Session = Depends(get_db),
) -> list[Application]:

    try:
        applications = db.query(Application).all()
        return applications

    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        ) from error
        
@router.get("/{application_id}/resume-text")
def get_resume_text(
    application_id: int,
    db: Session = Depends(get_db),
) -> dict[str, object]:

    application = db.get(Application, application_id)

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    if not application.resume_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found for this application",
        )

    try:
        text = extract_resume_text(application.resume_url)

        return {
            "application_id": application.id,
            "resume_file": application.resume_url,
            "text": text,
        }

    except ResumeExtractionError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error