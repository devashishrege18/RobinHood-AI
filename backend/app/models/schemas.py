"""
Pydantic models for API request and response schemas.
"""

from pydantic import BaseModel, Field


# ─── Contract Analysis (new primary flow) ───

class RiskItem(BaseModel):
    """A single identified risk in the contract."""
    title: str = Field(..., description="Short risk title")
    severity: str = Field(..., description="'high', 'medium', or 'low'")
    description: str = Field(..., description="Explanation of the risk")
    clause_ref: str = Field("", description="Reference to the clause if available")


class MarketComparison(BaseModel):
    """Market price comparison data."""
    commodity: str = Field("", description="Name of the commodity/product")
    unit: str = Field("", description="Unit of measurement")
    market_price: str = Field("", description="Average market price")
    offered_price: str = Field("", description="Price offered in the contract")
    difference: str = Field("", description="Percentage difference")


class AnalyzeRequest(BaseModel):
    """Request body for /api/analyze endpoint."""
    text: str = Field("", description="Transcribed voice text or typed input")
    file_content: str = Field("", description="Base64-encoded file content")
    file_name: str = Field("", description="Original filename")
    language: str = Field("en", description="Language code")


class AnalyzeResponse(BaseModel):
    """Full contract analysis response."""
    risk_score: int = Field(50, description="Overall risk score 0-100")
    risk_level: str = Field("medium", description="'low', 'medium', or 'high'")
    risks: list[RiskItem] = Field(default_factory=list, description="Identified risks")
    market_comparison: MarketComparison = Field(
        default_factory=MarketComparison,
        description="Market price comparison",
    )
    suggested_price: str = Field("", description="AI-suggested counter offer")
    improvement_pct: str = Field("", description="Potential improvement percentage")
    confidence: str = Field("medium", description="'low', 'medium', 'high'")
    price_reasoning: list[str] = Field(
        default_factory=list, description="Why this price is suggested"
    )
    negotiation_points: list[str] = Field(
        default_factory=list, description="Talk track / negotiation points"
    )
    summary: str = Field("", description="Brief summary of the analysis")


# ─── Legacy negotiate endpoint (kept for compatibility) ───

class ChatMessage(BaseModel):
    """A single message in the conversation history."""
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text")


class NegotiateRequest(BaseModel):
    """Request body for the /api/negotiate endpoint."""
    user_type: str = Field(...)
    product: str = Field(...)
    quantity: str = Field("")
    current_price: str = Field("")
    target_price: str = Field("")
    context: str = Field("")
    conversation_history: list[ChatMessage] = Field(default_factory=list)


class NegotiateResponse(BaseModel):
    """Structured response from the AI negotiation advisor."""
    advice: str = Field(...)
    suggested_price: str = Field("")
    negotiation_tips: list[str] = Field(default_factory=list)
    market_insights: str = Field("")
    confidence: str = Field("medium")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "ok"
