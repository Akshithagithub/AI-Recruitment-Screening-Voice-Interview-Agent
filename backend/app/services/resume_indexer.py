from app.services.resume_extractor import extract_resume_text
from app.services.embedding_service import generate_embedding
from app.services.qdrant_service import (
    create_resume_collection,
    store_resume_embedding,
)


def index_resume(
    resume_id: int,
    resume_path: str,
    candidate_name: str | None = None,
):
    # 1. Extract resume text
    resume_text = extract_resume_text(resume_path)

    if not resume_text.strip():
        raise ValueError("No text could be extracted from resume")

    # 2. Generate embedding
    embedding = generate_embedding(resume_text)

    # 3. Make sure Qdrant collection exists
    create_resume_collection()

    # 4. Store embedding + metadata
    store_resume_embedding(
        resume_id=resume_id,
        embedding=embedding,
        payload={
            "resume_id": resume_id,
            "candidate_name": candidate_name,
            "resume_path": resume_path,
        },
    )

    return {
        "resume_id": resume_id,
        "text_length": len(resume_text),
        "embedding_dimensions": len(embedding),
    }