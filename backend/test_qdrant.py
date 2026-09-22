from app.services.embedding_service import generate_embedding
from app.services.qdrant_service import search_resume_embeddings

query = """
Python and Generative AI experience with FastAPI, LLMs and RAG
"""

query_embedding = generate_embedding(query)

results = search_resume_embeddings(
    query_embedding=query_embedding,
    limit=5,
)

print("\nSearch Results:")

for result in results:
    print("Resume ID:", result.id)
    print("Score:", result.score)
    print("Payload:", result.payload)