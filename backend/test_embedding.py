from app.services.embedding_service import generate_embedding


text = """
Generative AI Engineer with experience in Python,
FastAPI, LLMs, RAG, vector databases and voice AI.
"""

print("Generating embedding...")

embedding = generate_embedding(text)

print("Embedding generated successfully")
print("Dimensions:", len(embedding))
print("First 5 values:", embedding[:5])