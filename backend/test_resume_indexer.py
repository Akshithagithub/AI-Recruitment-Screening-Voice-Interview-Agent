from app.services.resume_indexer import index_resume


resume_path = r"E:\ai-recruitment-voice-agent\uploads\resumes\c264fdcdb61f4e52b98e93110afe1d82.pdf"

result = index_resume(
    resume_id=3,
    resume_path=resume_path,
    candidate_name="Akshitha",
)

print("\nResume indexed successfully!")
print(result)