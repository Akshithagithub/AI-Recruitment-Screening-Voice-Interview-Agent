from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"message": "AI Recruitment Voice Agent backend is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}