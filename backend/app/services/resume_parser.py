import json

import httpx

from app.schemas import ResumeProfile


OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "qwen3:8b"


class ResumeParserError(Exception):
    """Raised when resume parsing fails."""


def parse_resume_text(resume_text: str) -> ResumeProfile:
    """
    Send extracted resume text to Qwen3-8B through Ollama
    and convert the response into a ResumeProfile.
    """

    if not resume_text.strip():
        raise ResumeParserError("Resume text is empty")

    prompt = f"""
You are a resume information extraction system.

Extract structured information from the resume text below.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.
Do not invent information that is not present in the resume.

The JSON must contain exactly these fields:

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

For education, use objects with:
- institution
- degree
- field_of_study
- duration

For experience, use objects with:
- company
- role
- duration
- description

For projects, use objects with:
- name
- description
- technologies

If information is missing, use null or an empty list.

Resume text:
----------------
{resume_text}
----------------
"""

    payload = {
        "model": OLLAMA_MODEL,
        "keep_alive": "10m",
        "messages": [
            {
                "role": "user",
                "content": prompt,
            }
        ],
        "stream": False,
        "format": "json",
        "think": False,
        "options": {
            "temperature": 0,
        },
    }

    try:
        response = httpx.post(
            OLLAMA_URL,
            json=payload,
            timeout=300.0,
        )

        response.raise_for_status()

    except httpx.HTTPError as error:
        raise ResumeParserError(
            "Failed to communicate with Ollama"
        ) from error

    try:
        response_data = response.json()

        content = response_data["message"]["content"]

        parsed_data = json.loads(content)

        return ResumeProfile.model_validate(parsed_data)

    except (KeyError, TypeError, ValueError) as error:
        raise ResumeParserError(
            "Qwen returned an invalid resume structure"
        ) from error