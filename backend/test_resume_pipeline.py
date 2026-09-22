from app.services.resume_pipeline import process_resume


resume_path = r"E:\ai-recruitment-voice-agent\uploads\resumes\c264fdcdb61f4e52b98e93110afe1d82.pdf"

result = process_resume(
    resume_id=3,
    resume_path=resume_path,
    candidate_name="Akshitha",
)

print("\n===== RESUME PIPELINE COMPLETE =====")
print("Resume ID:", result["resume_id"])
print("Text Length:", result["text_length"])
print("Embedding Dimensions:", result["embedding_dimensions"])

print("\n===== RESUME PROFILE =====")
print(result["profile"])