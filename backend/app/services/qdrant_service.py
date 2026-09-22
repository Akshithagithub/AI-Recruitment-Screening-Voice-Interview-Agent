from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client.models import SearchParams


QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "resume_embeddings"
VECTOR_SIZE = 384


client = QdrantClient(url=QDRANT_URL)


def create_resume_collection():
    collections = client.get_collections().collections

    existing_collections = [collection.name for collection in collections]

    if COLLECTION_NAME not in existing_collections:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE,
            ),
        )

        print(f"Created Qdrant collection: {COLLECTION_NAME}")
    else:
        print(f"Qdrant collection already exists: {COLLECTION_NAME}")
        
def store_resume_embedding(
    resume_id: int,
    embedding: list[float],
    payload: dict,
):
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=resume_id,
                vector=embedding,
                payload=payload,
            )
        ],
    )

    print(f"Stored resume embedding for resume_id={resume_id}")
    
def search_resume_embeddings(
    query_embedding: list[float],
    limit: int = 5,
):
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=limit,
    )

    return results.points