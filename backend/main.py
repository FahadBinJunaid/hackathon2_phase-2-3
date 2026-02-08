import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes import auth, todos

load_dotenv()

app = FastAPI(
    title="Todo API",
    description="FastAPI backend with JWT authentication and multi-tenant todo management",
    version="1.0.0"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(todos.router)


@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is running."""
    return {"status": "healthy"}
