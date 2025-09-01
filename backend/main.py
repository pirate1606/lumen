#!/usr/bin/env python3
"""
LUMEN Backend Server
AI-powered healthcare assistant with Hugging Face models
"""

import os
import asyncio
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import LUMEN modules
from lumen_models import LumenModels
from lumen_services import (
    ChatbotService,
    VoiceService,
    LabAnalyzerService,
    DermatologyService,
    EmergencyService,
    GovernmentSchemesService
)

# Configure logging - Reduced verbosity
logging.basicConfig(
    level=logging.WARNING,  # Changed from INFO to WARNING
    format='%(levelname)s:%(name)s:%(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

# Reduce noise from specific libraries
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("torch").setLevel(logging.ERROR)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="LUMEN Healthcare Assistant",
    description="AI-powered healthcare assistant with multilingual support",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
logger.info("Initializing LUMEN services...")
models = LumenModels()
chatbot_service = ChatbotService(models)
voice_service = VoiceService(models)
lab_service = LabAnalyzerService(models)
dermatology_service = DermatologyService(models)
emergency_service = EmergencyService(models)
govt_service = GovernmentSchemesService(models)
logger.info("LUMEN services initialized successfully")

# Pydantic models for API requests/responses
class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    language: str
    confidence: float
    triage_level: str  # Green, Yellow, Red

class VoiceRequest(BaseModel):
    language: str = "en"
    text: str

class LabAnalysisRequest(BaseModel):
    language: str = "en"
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None

class EmergencyRequest(BaseModel):
    emergency_type: str  # snakebite, drowning, burns, electric_shock
    language: str = "en"

class GovernmentSchemeRequest(BaseModel):
    query: str
    language: str = "en"
    state: Optional[str] = None

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "LUMEN Backend"}

# Chatbot endpoints
@app.post("/api/chat/symptoms", response_model=ChatResponse)
async def chat_symptoms(request: ChatRequest):
    """Symptoms-based diagnosis and guidance"""
    try:
        response = await chatbot_service.process_symptoms(
            request.message, 
            request.language, 
            request.context
        )
        return response
    except Exception as e:
        logger.error(f"Error in symptoms chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat/general")
async def general_chat(request: ChatRequest):
    """General healthcare conversation"""
    try:
        response = await chatbot_service.general_conversation(
            request.message, 
            request.language
        )
        return {"response": response, "language": request.language}
    except Exception as e:
        logger.error(f"Error in general chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Voice processing endpoints
@app.post("/api/voice/speech-to-text")
async def speech_to_text(
    audio: UploadFile = File(...),
    language: str = Form("en")
):
    """Convert speech to text using Whisper"""
    try:
        if not audio.filename:
            raise HTTPException(status_code=400, detail="No audio file provided")
        
        # Save audio temporarily
        temp_path = f"/tmp/{audio.filename}"
        with open(temp_path, "wb") as buffer:
            content = await audio.read()
            buffer.write(content)
        
        text = await voice_service.speech_to_text(temp_path, language)
        
        # Clean up
        os.remove(temp_path)
        
        return {"text": text, "language": language}
    except Exception as e:
        logger.error(f"Error in speech-to-text: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice/text-to-speech")
async def text_to_speech(request: VoiceRequest):
    """Convert text to speech using XTTS"""
    try:
        audio_data = await voice_service.text_to_speech(
            request.text, 
            request.language
        )
        return {"audio": audio_data, "language": request.language}
    except Exception as e:
        logger.error(f"Error in text-to-speech: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Lab analysis endpoints
@app.post("/api/lab/analyze")
async def analyze_lab_report(
    report: UploadFile = File(...),
    request: LabAnalysisRequest = Form(...)
):
    """Analyze lab report using Donut OCR and AI analysis"""
    try:
        if not report.filename:
            raise HTTPException(status_code=400, detail="No report file provided")
        
        # Save report temporarily
        temp_path = f"/tmp/{report.filename}"
        with open(temp_path, "wb") as buffer:
            content = await report.read()
            buffer.write(content)
        
        analysis = await lab_service.analyze_report(
            temp_path, 
            request.language,
            request.patient_age,
            request.patient_gender
        )
        
        # Clean up
        os.remove(temp_path)
        
        return analysis
    except Exception as e:
        logger.error(f"Error in lab analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Dermatology endpoints
@app.post("/api/dermatology/analyze")
async def analyze_skin_condition(
    image: UploadFile = File(...),
    language: str = Form("en"),
    symptoms: Optional[str] = Form(None)
):
    """Analyze skin condition using BLIP image captioning"""
    try:
        if not image.filename:
            raise HTTPException(status_code=400, detail="No image file provided")
        
        # Save image temporarily
        temp_path = f"/tmp/{image.filename}"
        with open(temp_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
        
        analysis = await dermatology_service.analyze_skin_condition(
            temp_path, 
            language, 
            symptoms
        )
        
        # Clean up
        os.remove(temp_path)
        
        return analysis
    except Exception as e:
        logger.error(f"Error in dermatology analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Emergency education endpoints
@app.post("/api/emergency/guide")
async def get_emergency_guide(request: EmergencyRequest):
    """Get emergency first aid guide"""
    try:
        guide = await emergency_service.get_emergency_guide(
            request.emergency_type, 
            request.language
        )
        return guide
    except Exception as e:
        logger.error(f"Error in emergency guide: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/emergency/types")
async def get_emergency_types():
    """Get list of supported emergency types"""
    return {
        "emergency_types": [
            "snakebite", "drowning", "burns", "electric_shock",
            "choking", "bleeding", "fracture", "heart_attack"
        ]
    }

# Government schemes endpoints
@app.post("/api/government/schemes")
async def search_government_schemes(request: GovernmentSchemeRequest):
    """Search government health schemes and benefits"""
    try:
        schemes = await govt_service.search_schemes(
            request.query, 
            request.language, 
            request.state
        )
        return schemes
    except Exception as e:
        logger.error(f"Error in government schemes search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/government/states")
async def get_supported_states():
    """Get list of supported Indian states"""
    return {
        "states": [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
            "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
            "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
            "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
            "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
            "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
            "West Bengal"
        ]
    }

# Model information endpoint
@app.get("/api/models/info")
async def get_model_info():
    """Get information about available models"""
    return {
        "models": {
            "chatbot": "ai4bharat/indic-gpt",
            "speech_to_text": "openai/whisper-small",
            "text_to_speech": "coqui/XTTS-v2",
            "lab_analysis": "naver-clova-ix/donut-base-finetuned-docvqa",
            "dermatology": "Salesforce/blip-image-captioning-base",
            "embeddings": "sentence-transformers/all-mpnet-base-v2",
            "multilingual_embeddings": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        },
        "supported_languages": [
            "en", "hi", "ta", "bn", "te", "mr", "gu", "kn", "ml", "pa", "or", "as"
        ]
    }

if __name__ == "__main__":
    # Create data directories
    Path("./data/vector_db").mkdir(parents=True, exist_ok=True)
    Path("./data/uploads").mkdir(parents=True, exist_ok=True)
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    logger.info(f"Starting LUMEN Backend on {host}:{port}")
    
    # Run the server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
