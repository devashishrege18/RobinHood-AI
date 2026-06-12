"""
Gemini 2.5 Flash integration service.
"""

import json
import logging
import base64

from google import genai
from google.genai import types

from app.config import settings
from app.models.schemas import (
    AnalyzeResponse,
    ChatMessage,
    NegotiateResponse,
    RiskItem,
    MarketComparison,
)
from app.prompts.negotiation import (
    CONTRACT_ANALYSIS_PROMPT,
    build_system_prompt,
    build_user_message,
)

logger = logging.getLogger(__name__)

client = genai.Client(api_key=settings.gemini_api_key)


async def analyze_contract(
    text: str,
    file_content: str = "",
    file_name: str = "",
    language: str = "en",
) -> AnalyzeResponse:
    """
    Analyze a contract or deal using Gemini 2.5 Flash.
    Accepts voice-transcribed text and/or uploaded file content.
    """
    contents: list[types.Content] = []

    # Build the user message
    user_parts = []

    if text:
        user_parts.append(
            types.Part.from_text(text=f"User says: {text}")
        )

    if file_content:
        # Try to decode base64 file and send as text
        try:
            decoded = base64.b64decode(file_content).decode("utf-8", errors="replace")
            user_parts.append(
                types.Part.from_text(
                    text=f"--- Contract Document ({file_name}) ---\n{decoded}"
                )
            )
        except Exception:
            user_parts.append(
                types.Part.from_text(
                    text=f"[File uploaded: {file_name} — could not decode content]"
                )
            )

    if not user_parts:
        user_parts.append(
            types.Part.from_text(text="Please provide a general negotiation overview.")
        )

    contents.append(types.Content(role="user", parts=user_parts))

    try:
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=CONTRACT_ANALYSIS_PROMPT,
                temperature=settings.gemini_temperature,
                response_mime_type="application/json",
                response_schema=AnalyzeResponse,
            ),
        )

        result = json.loads(response.text)
        return AnalyzeResponse(**result)

    except json.JSONDecodeError as e:
        logger.error("Failed to parse Gemini response: %s", e)
        return AnalyzeResponse(
            risk_score=50,
            risk_level="medium",
            risks=[
                RiskItem(
                    title="Analysis Incomplete",
                    severity="medium",
                    description="Could not fully parse the response. Please try again with more details.",
                )
            ],
            summary="Analysis could not be completed. Please try rephrasing your input.",
            confidence="low",
        )
    except Exception as e:
        logger.error("Gemini API error: %s", e)
        raise


async def get_negotiation_advice(
    user_type: str,
    product: str,
    quantity: str,
    current_price: str,
    target_price: str,
    context: str,
    conversation_history: list[ChatMessage],
) -> NegotiateResponse:
    """Legacy negotiate endpoint — kept for backward compatibility."""
    system_prompt = build_system_prompt(user_type)

    contents: list[types.Content] = []
    for msg in conversation_history:
        role = "user" if msg.role == "user" else "model"
        contents.append(
            types.Content(role=role, parts=[types.Part.from_text(text=msg.content)])
        )

    user_message = build_user_message(product, quantity, current_price, target_price, context)
    contents.append(
        types.Content(role="user", parts=[types.Part.from_text(text=user_message)])
    )

    try:
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=settings.gemini_temperature,
                response_mime_type="application/json",
                response_schema=NegotiateResponse,
            ),
        )
        result = json.loads(response.text)
        return NegotiateResponse(**result)
    except json.JSONDecodeError:
        return NegotiateResponse(
            advice="I had trouble processing that. Please try again.",
            confidence="low",
        )
    except Exception as e:
        logger.error("Gemini API error: %s", e)
        raise
