"""
RobinHood AI — FastAPI Application Entry Point.

Configures CORS, mounts routers, and sets up logging.
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import negotiate

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# Create the FastAPI app
app = FastAPI(
    title="RobinHood AI",
    description="AI-powered negotiation advisor for farmers, retailers, and small businesses.",
    version="0.1.0",
)

# CORS — allow all origins for deployment (Vercel frontend → Render backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(negotiate.router)


@app.get("/")
async def root():
    """Root redirect to API docs."""
    return {
        "app": "RobinHood AI",
        "version": "0.1.0",
        "docs": "/docs",
        "message": "Visit /docs for API documentation.",
    }
