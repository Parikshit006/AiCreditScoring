from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(title="AI Credit Scoring API", version="1.0.0")

# CORS Configuration
origins = [
    "http://localhost:5173",  # React usually runs here
    "http://localhost:3000",
    "*" # Allow all for hackathon prototype
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Credit Scoring API v2"}
