import json
import time

import httpx

from app.services.resume_extractor import extract_resume_text


OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "phi3:latest"


resume_path = (
    r"E:\ai-recruitment-voice-agent\uploads\resumes"
    r"\c264fdcdb61f4e52b98e93110afe1d82.pdf"
)


print("Extracting resume text...")

start = time.perf_counter()

text = extract_resume_text(resume_path)

extraction_time = time.perf_counter() - start

print(f"Extraction completed in {extraction_time:.2f} seconds")
print(f"Extracted characters: {len(text)}")


prompt = f"""
Extract structured information from this resume.

Return ONLY valid JSON with these fields:

{{
    "name": null,
    "email": null,
    "phone": null,
    "skills": [],
    "education": [],
    "experience": [],
    "projects": [],
    "certifications": []
}}

For education use:
institution, degree, field_of_study, duration

For experience use:
company, role, duration, description

For projects use:
name, description, technologies

Do not invent information.

Resume:
{text}
"""


payload = {
    "model": OLLAMA_MODEL,
    "messages": [
        {
            "role": "user",
            "content": prompt,
        }
    ],
    "stream": False,
    "format": "json",
    "options": {
        "temperature": 0,
    },
}


print("\nParsing resume with Phi-3...")

start = time.perf_counter()

response = httpx.post(
    OLLAMA_URL,
    json=payload,
    timeout=300.0,
)

parsing_time = time.perf_counter() - start

response.raise_for_status()

print(f"Parsing completed in {parsing_time:.2f} seconds")

response_data = response.json()

content = response_data["message"]["content"]

print("\nPhi-3 output:")
print(json.dumps(json.loads(content), indent=2))