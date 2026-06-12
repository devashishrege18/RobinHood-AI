"""
API routers for negotiation and contract analysis.
"""

import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    HealthResponse,
    NegotiateRequest,
    NegotiateResponse,
)
from app.services.gemini_service import analyze_contract, get_negotiation_advice

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["negotiate"])


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    """
    Analyze a contract or deal from voice input and/or uploaded document.
    Returns risk analysis, market comparison, and negotiation strategy.
    """
    if not request.text.strip() and not request.file_content.strip():
        raise HTTPException(
            status_code=400,
            detail="Please provide either voice input or upload a document.",
        )

    try:
        response = await analyze_contract(
            text=request.text,
            file_content=request.file_content,
            file_name=request.file_name,
            language=request.language,
        )
        return response
    except Exception as e:
        logger.error("Analysis error: %s", e)
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze. Please try again.",
        ) from e


@router.post("/negotiate", response_model=NegotiateResponse)
async def negotiate(request: NegotiateRequest) -> NegotiateResponse:
    """Legacy negotiate endpoint."""
    valid_types = {"farmer", "retailer", "small_business"}
    if request.user_type not in valid_types:
        raise HTTPException(status_code=400, detail="Invalid user_type.")
    if not request.product.strip():
        raise HTTPException(status_code=400, detail="Product field is required.")

    try:
        return await get_negotiation_advice(
            user_type=request.user_type,
            product=request.product,
            quantity=request.quantity,
            current_price=request.current_price,
            target_price=request.target_price,
            context=request.context,
            conversation_history=request.conversation_history,
        )
    except Exception as e:
        logger.error("Negotiation error: %s", e)
        raise HTTPException(status_code=500, detail="Failed to get advice.") from e


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok")
