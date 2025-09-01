#!/usr/bin/env python3
"""
LUMEN Models Module
Manages all Hugging Face models for healthcare AI features
"""

import os
import logging
from typing import Dict, Any, Optional
from transformers import (
    pipeline, AutoTokenizer, AutoModelForCausalLM, 
    AutoProcessor, AutoModelForSpeechSeq2Seq,
    AutoModelForVision2Seq, AutoModel
)
from sentence_transformers import SentenceTransformer
import torch

logger = logging.getLogger(__name__)

class LumenModels:
    """Manages all Hugging Face models for LUMEN"""
    
    def __init__(self):
        """Initialize all models"""
        self.hf_api_key = os.getenv("HF_API_KEY")
        if not self.hf_api_key:
            logger.warning("HF_API_KEY not found. Some features may not work.")
        
        # Model configurations - Updated to use working, public models
        self.model_configs = {
            "chatbot": os.getenv("CHATBOT_MODEL", "microsoft/DialoGPT-medium"),  # Working alternative
            "whisper": os.getenv("WHISPER_MODEL", "openai/whisper-small"),
            "xtts": os.getenv("XTTS_MODEL", "facebook/tts-ms-en-ljspeech"),  # Working TTS alternative
            "donut": os.getenv("DONUT_MODEL", "naver-clova-ix/donut-base-finetuned-cord-v2"),  # Working OCR model
            "blip": os.getenv("BLIP_MODEL", "Salesforce/blip-image-captioning-base"),
            "embedding": os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-mpnet-base-v2"),
            "multilingual_embedding": os.getenv("MULTILINGUAL_EMBEDDING_MODEL", 
                                              "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
        }
        
        # Initialize models
        self.models = {}
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize all models (lazy loading)"""
        logger.info("Initializing LUMEN models...")
        
        # Initialize models as needed
        self._init_chatbot_model()
        self._init_voice_models()
        self._init_vision_models()
        self._init_embedding_models()
        
        logger.info("Model initialization complete")
    
    def _init_chatbot_model(self):
        """Initialize chatbot model"""
        try:
            logger.info(f"Loading chatbot model: {self.model_configs['chatbot']}")
            
            # Use pipeline for easier inference
            self.models['chatbot'] = pipeline(
                "text-generation",
                model=self.model_configs['chatbot'],
                token=self.hf_api_key,
                device="cuda" if torch.cuda.is_available() else "cpu"
            )
            
            logger.info("Chatbot model loaded successfully")
        except Exception as e:
            logger.warning(f"Failed to load chatbot model: {str(e)[:100]}...")  # Truncate long errors
            self.models['chatbot'] = None
    
    def _init_voice_models(self):
        """Initialize voice processing models"""
        try:
            # Whisper for speech-to-text
            logger.info(f"Loading Whisper model: {self.model_configs['whisper']}")
            self.models['whisper'] = pipeline(
                "automatic-speech-recognition",
                model=self.model_configs['whisper'],
                token=self.hf_api_key,
                device="cuda" if torch.cuda.is_available() else "cpu"
            )
            
            # FastSpeech2 for text-to-speech (working alternative to XTTS)
            logger.info(f"Loading TTS model: {self.model_configs['xtts']}")
            try:
                self.models['xtts'] = pipeline(
                    "text-to-speech",
                    model=self.model_configs['xtts'],
                    token=self.hf_api_key,
                    device="cuda" if torch.cuda.is_available() else "cpu"
                )
            except Exception as tts_error:
                logger.warning(f"TTS model failed, using fallback: {str(tts_error)[:80]}...")
                self.models['xtts'] = None
            
            logger.info("Voice models loaded successfully")
        except Exception as e:
            logger.warning(f"Failed to load voice models: {str(e)[:100]}...")
            self.models['whisper'] = None
            self.models['xtts'] = None
    
    def _init_vision_models(self):
        """Initialize computer vision models"""
        try:
            # Donut for document understanding
            logger.info(f"Loading Donut model: {self.model_configs['donut']}")
            try:
                self.models['donut'] = pipeline(
                    "document-question-answering",
                    model=self.model_configs['donut'],
                    token=self.hf_api_key,
                    device="cuda" if torch.cuda.is_available() else "cpu"
                )
            except Exception as donut_error:
                logger.warning(f"Donut model failed, using fallback: {str(donut_error)[:80]}...")
                self.models['donut'] = None
            
            # BLIP for image captioning
            logger.info(f"Loading BLIP model: {self.model_configs['blip']}")
            try:
                self.models['blip'] = pipeline(
                    "image-to-text",
                    model=self.model_configs['blip'],
                    token=self.hf_api_key,
                    device="cuda" if torch.cuda.is_available() else "cpu"
                )
            except Exception as blip_error:
                logger.warning(f"BLIP model failed, using fallback: {str(blip_error)[:80]}...")
                self.models['blip'] = None
            
            if self.models['donut'] or self.models['blip']:
                logger.info("Vision models loaded successfully")
            else:
                logger.warning("No vision models loaded successfully")
        except Exception as e:
            logger.warning(f"Failed to load vision models: {str(e)[:100]}...")
            self.models['donut'] = None
            self.models['blip'] = None
    
    def _init_embedding_models(self):
        """Initialize embedding models"""
        try:
            # General embeddings
            logger.info(f"Loading embedding model: {self.model_configs['embedding']}")
            self.models['embedding'] = SentenceTransformer(
                self.model_configs['embedding'],
                device="cuda" if torch.cuda.is_available() else "cpu"
            )
            
            # Multilingual embeddings
            logger.info(f"Loading multilingual embedding model: {self.model_configs['multilingual_embedding']}")
            self.models['multilingual_embedding'] = SentenceTransformer(
                self.model_configs['multilingual_embedding'],
                device="cuda" if torch.cuda.is_available() else "cpu"
            )
            
            logger.info("Embedding models loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load embedding models: {e}")
            self.models['embedding'] = None
            self.models['multilingual_embedding'] = None
    
    def get_model(self, model_type: str):
        """Get a specific model by type"""
        return self.models.get(model_type)
    
    def is_model_available(self, model_type: str) -> bool:
        """Check if a model is available"""
        return self.models.get(model_type) is not None
    
    def get_available_models(self) -> Dict[str, bool]:
        """Get status of all models"""
        return {
            model_type: self.is_model_available(model_type)
            for model_type in self.models.keys()
        }
    
    def reload_model(self, model_type: str):
        """Reload a specific model"""
        logger.info(f"Reloading {model_type} model...")
        
        if model_type == 'chatbot':
            self._init_chatbot_model()
        elif model_type in ['whisper', 'xtts']:
            self._init_voice_models()
        elif model_type in ['donut', 'blip']:
            self._init_vision_models()
        elif model_type in ['embedding', 'multilingual_embedding']:
            self._init_embedding_models()
        else:
            logger.warning(f"Unknown model type: {model_type}")
    
    def get_device_info(self) -> Dict[str, Any]:
        """Get information about available devices"""
        return {
            "cuda_available": torch.cuda.is_available(),
            "cuda_device_count": torch.cuda.device_count() if torch.cuda.is_available() else 0,
            "current_device": "cuda" if torch.cuda.is_available() else "cpu",
            "device_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
        }
    
    def cleanup(self):
        """Clean up models and free memory"""
        logger.info("Cleaning up models...")
        
        # Clear models
        for model_type in self.models:
            if hasattr(self.models[model_type], 'to'):
                self.models[model_type].to('cpu')
            del self.models[model_type]
        
        self.models.clear()
        
        # Clear CUDA cache if available
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        
        logger.info("Model cleanup complete")
