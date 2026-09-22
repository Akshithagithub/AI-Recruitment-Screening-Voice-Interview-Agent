from app.services.resume_extractor import extract_resume_text
from app.services.resume_parser import parse_resume_text
from app.services.embedding_service import generate_embedding
from app.services.qdrant_service import (
    create_resume_collection,
    store_resume_embedding,
)


def process_resume(
    resume_id: int,
    resume_path: str,
    candidate_name: str | None = None,
):
    # 1. Extract text from the resume
    resume_text = extract_resume_text(resume_path)

    if not resume_text.strip():
        raise ValueError("No text could be extracted from resume")

    # 2. Parse resume using Qwen3-8B
    resume_profile = parse_resume_text(resume_text)

    # 3. Generate embedding
    embedding = generate_embedding(resume_text)

    # 4. Make sure Qdrant collection exists
    create_resume_collection()

    # 5. Store embedding and metadata in Qdrant
    store_resume_embedding(
        resume_id=resume_id,
        embedding=embedding,
        payload={
            "resume_id": resume_id,
            "candidate_name": candidate_name,
            "resume_path": resume_path,
            "name": resume_profile.name,
            "email": resume_profile.email,
            "phone": resume_profile.phone,
            "skills": resume_profile.skills,
        },
    )

    return {
        "resume_id": resume_id,
        "text_length": len(resume_text),
        "profile": resume_profile.model_dump(),
        "embedding_dimensions": len(embedding),
    }