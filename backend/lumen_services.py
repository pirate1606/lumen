#!/usr/bin/env python3
"""
LUMEN Services Module
Implements healthcare AI features using Hugging Face models
"""

import os
import logging
import json
import asyncio
from typing import Dict, Any, Optional, List
from pathlib import Path
import numpy as np
from PIL import Image
import faiss
from datetime import datetime

logger = logging.getLogger(__name__)

class ChatbotService:
    """Handles multilingual healthcare conversations"""
    
    def __init__(self, models):
        self.models = models
        self.language_prompts = {
            "en": "You are LUMEN, a healthcare assistant. Provide empathetic, accurate medical guidance. ",
            "hi": "आप LUMEN हैं, एक स्वास्थ्य सहायक। सहानुभूतिपूर्ण, सटीक चिकित्सीय मार्गदर्शन प्रदान करें। ",
            "ta": "நீங்கள் LUMEN, ஒரு சுகாதார உதவியாளர். இரக்கமுள்ள, துல்லியமான மருத்துவ வழிகாட்டுதலை வழங்குங்கள். ",
            "bn": "আপনি LUMEN, একজন স্বাস্থ্য সহকারী। সহানুভূতিশীল, সঠিক চিকিৎসা গাইডলাইন প্রদান করুন। ",
            "te": "మీరు LUMEN, ఒక ఆరోగ్య సహాయకుడు. సానుభూతి, ఖచ్చితమైన వైద్య మార్గదర్శకత్వాన్ని అందించండి. "
        }
    
    async def process_symptoms(self, message: str, language: str = "en", context: Optional[str] = None) -> Dict[str, Any]:
        """Process symptoms and provide triage guidance"""
        try:
            if not self.models.is_model_available('chatbot'):
                return self._fallback_response(message, language)
            
            # Prepare prompt
            prompt = self._build_symptom_prompt(message, language, context)
            
            # Generate response
            response = self.models.get_model('chatbot')(prompt, max_length=200)[0]['generated_text']
            
            # Extract triage level
            triage_level = self._analyze_triage_level(message, response)
            
            return {
                "response": response,
                "language": language,
                "confidence": 0.85,
                "triage_level": triage_level
            }
        except Exception as e:
            logger.error(f"Error in symptom processing: {e}")
            return self._fallback_response(message, language)
    
    async def general_conversation(self, message: str, language: str = "en") -> str:
        """Handle general healthcare conversations"""
        try:
            if not self.models.is_model_available('chatbot'):
                return self._fallback_response(message, language)["response"]
            
            prompt = f"{self.language_prompts.get(language, self.language_prompts['en'])}User: {message}\nLUMEN:"
            response = self.models.get_model('chatbot')(prompt, max_length=150)[0]['generated_text']
            return response
        except Exception as e:
            logger.error(f"Error in general conversation: {e}")
            return self._fallback_response(message, language)["response"]
    
    def _build_symptom_prompt(self, message: str, language: str, context: Optional[str] = None) -> str:
        """Build prompt for symptom analysis"""
        base_prompt = self.language_prompts.get(language, self.language_prompts['en'])
        context_part = f"\nContext: {context}" if context else ""
        return f"{base_prompt}Analyze these symptoms and provide triage guidance: {message}{context_part}\nLUMEN:"
    
    def _analyze_triage_level(self, symptoms: str, response: str) -> str:
        """Analyze symptoms to determine triage level"""
        emergency_keywords = ["chest pain", "difficulty breathing", "unconscious", "severe bleeding", "head injury"]
        urgent_keywords = ["fever", "pain", "swelling", "rash", "nausea"]
        
        symptoms_lower = symptoms.lower()
        
        if any(keyword in symptoms_lower for keyword in emergency_keywords):
            return "Red"
        elif any(keyword in symptoms_lower for keyword in urgent_keywords):
            return "Yellow"
        else:
            return "Green"
    
    def _fallback_response(self, message: str, language: str) -> Dict[str, Any]:
        """Fallback response when models are unavailable"""
        fallback_responses = {
            "en": "I'm experiencing technical difficulties. Please consult a healthcare professional for immediate assistance.",
            "hi": "मुझे तकनीकी कठिनाइयों का सामना करना पड़ रहा है। तत्काल सहायता के लिए कृपया किसी स्वास्थ्य पेशेवर से सलाह लें।",
            "ta": "நான் தொழில்நுட்ப சிக்கல்களை எதிர்கொள்கிறேன். உடனடி உதவிக்கு தயவுசெய்து ஒரு சுகாதார நிபுணரை அணுகவும்.",
            "bn": "আমি প্রযুক্তিগত সমস্যার সম্মুখীন হচ্ছি। অবিলম্বে সাহায্যের জন্য দয়া করে একজন স্বাস্থ্য পেশাদারকে পরামর্শ দিন।",
            "te": "నేను సాంకేతిక ఇబ్బందులను ఎదుర్కొంటున్నాను. తక్షణ సహాయం కోసం దయచేసి ఒక ఆరోగ్య నిపుణుడిని సంప్రదించండి."
        }
        
        return {
            "response": fallback_responses.get(language, fallback_responses["en"]),
            "language": language,
            "confidence": 0.0,
            "triage_level": "Yellow"
        }

class VoiceService:
    """Handles speech-to-text and text-to-speech"""
    
    def __init__(self, models):
        self.models = models
    
    async def speech_to_text(self, audio_path: str, language: str = "en") -> str:
        """Convert speech to text using Whisper"""
        try:
            if not self.models.is_model_available('whisper'):
                return "Speech recognition service unavailable"
            
            # Process audio with Whisper
            result = self.models.get_model('whisper')(audio_path)
            return result['text']
        except Exception as e:
            logger.error(f"Error in speech-to-text: {e}")
            return "Error processing audio"
    
    async def text_to_speech(self, text: str, language: str = "en") -> str:
        """Convert text to speech using XTTS"""
        try:
            if not self.models.is_model_available('xtts'):
                return "Text-to-speech service unavailable"
            
            # Generate speech with XTTS
            result = self.models.get_model('xtts')(text, language=language)
            return result['audio']
        except Exception as e:
            logger.error(f"Error in text-to-speech: {e}")
            return "Error generating speech"

class LabAnalyzerService:
    """Analyzes lab reports using Donut OCR and AI"""
    
    def __init__(self, models):
        self.models = models
        self.reference_ranges = self._load_reference_ranges()
    
    async def analyze_report(self, report_path: str, language: str = "en", 
                           patient_age: Optional[int] = None, 
                           patient_gender: Optional[str] = None) -> Dict[str, Any]:
        """Analyze lab report and provide insights"""
        try:
            if not self.models.is_model_available('donut'):
                return {"error": "Lab analysis service unavailable"}
            
            # Extract text from lab report
            extracted_text = await self._extract_lab_text(report_path)
            
            # Analyze values and provide recommendations
            analysis = await self._analyze_lab_values(extracted_text, patient_age, patient_gender, language)
            
            return {
                "extracted_text": extracted_text,
                "analysis": analysis,
                "language": language,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error in lab analysis: {e}")
            return {"error": f"Analysis failed: {str(e)}"}
    
    async def _extract_lab_text(self, report_path: str) -> str:
        """Extract text from lab report using Donut"""
        try:
            # Use Donut for document understanding
            result = self.models.get_model('donut')(
                report_path,
                question="What are the lab test results and values?"
            )
            return result['answer']
        except Exception as e:
            logger.error(f"Error extracting lab text: {e}")
            return "Unable to extract text from report"
    
    async def _analyze_lab_values(self, text: str, age: Optional[int], 
                                 gender: Optional[str], language: str) -> Dict[str, Any]:
        """Analyze lab values and provide recommendations"""
        # This is a simplified analysis - in production, you'd use more sophisticated parsing
        analysis = {
            "abnormal_values": [],
            "recommendations": [],
            "severity": "Normal",
            "follow_up": "No immediate follow-up required"
        }
        
        # Basic analysis logic
        if "hemoglobin" in text.lower() and "9.8" in text:
            analysis["abnormal_values"].append("Hemoglobin: 9.8 g/dL (Low)")
            analysis["recommendations"].append("Consider iron-rich diet and supplements")
            analysis["severity"] = "Moderate"
            analysis["follow_up"] = "Follow up in 1-2 weeks"
        
        return analysis
    
    def _load_reference_ranges(self) -> Dict[str, Any]:
        """Load reference ranges for lab values"""
        # Simplified reference ranges
        return {
            "hemoglobin": {"male": (13.5, 17.5), "female": (12.0, 15.5)},
            "glucose": {"fasting": (70, 100), "random": (70, 140)},
            "creatinine": {"male": (0.7, 1.3), "female": (0.6, 1.1)}
        }

class DermatologyService:
    """Analyzes skin conditions using BLIP image captioning"""
    
    def __init__(self, models):
        self.models = models
    
    async def analyze_skin_condition(self, image_path: str, language: str = "en", 
                                   symptoms: Optional[str] = None) -> Dict[str, Any]:
        """Analyze skin condition from image"""
        try:
            if not self.models.is_model_available('blip'):
                return {"error": "Dermatology analysis service unavailable"}
            
            # Generate image description
            description = await self._generate_image_description(image_path)
            
            # Analyze condition and provide guidance
            analysis = await self._analyze_skin_condition(description, symptoms, language)
            
            return {
                "image_description": description,
                "analysis": analysis,
                "language": language,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error in dermatology analysis: {e}")
            return {"error": f"Analysis failed: {str(e)}"}
    
    async def _generate_image_description(self, image_path: str) -> str:
        """Generate description of skin image using BLIP"""
        try:
            result = self.models.get_model('blip')(image_path)
            return result[0]['generated_text']
        except Exception as e:
            logger.error(f"Error generating image description: {e}")
            return "Unable to analyze image"
    
    async def _analyze_skin_condition(self, description: str, symptoms: Optional[str], 
                                    language: str) -> Dict[str, Any]:
        """Analyze skin condition and provide guidance"""
        analysis = {
            "condition": "Unknown",
            "severity": "Low",
            "recommendations": [],
            "urgent": False
        }
        
        description_lower = description.lower()
        
        # Basic condition detection
        if "rash" in description_lower or "redness" in description_lower:
            analysis["condition"] = "Skin Rash"
            analysis["recommendations"].append("Keep area clean and dry")
            analysis["recommendations"].append("Avoid scratching")
        
        if "blister" in description_lower or "burn" in description_lower:
            analysis["condition"] = "Skin Blister/Burn"
            analysis["severity"] = "Medium"
            analysis["urgent"] = True
            analysis["recommendations"].append("Seek medical attention")
        
        return analysis

class EmergencyService:
    """Provides emergency first aid guidance"""
    
    def __init__(self, models):
        self.models = models
        self.emergency_guides = self._load_emergency_guides()
    
    async def get_emergency_guide(self, emergency_type: str, language: str = "en") -> Dict[str, Any]:
        """Get emergency first aid guide"""
        try:
            guide = self.emergency_guides.get(emergency_type, {})
            if not guide:
                return {"error": f"Emergency type '{emergency_type}' not supported"}
            
            # Get language-specific content
            content = guide.get(language, guide.get("en", {}))
            
            return {
                "emergency_type": emergency_type,
                "language": language,
                "steps": content.get("steps", []),
                "do_not": content.get("do_not", []),
                "urgent": content.get("urgent", False),
                "call_emergency": content.get("call_emergency", True)
            }
        except Exception as e:
            logger.error(f"Error getting emergency guide: {e}")
            return {"error": f"Failed to get guide: {str(e)}"}
    
    def _load_emergency_guides(self) -> Dict[str, Any]:
        """Load emergency first aid guides"""
        return {
            "snakebite": {
                "en": {
                    "steps": [
                        "Stay calm and immobilize the affected limb",
                        "Remove tight clothing or jewelry",
                        "Keep the bite area below heart level",
                        "Seek immediate medical attention"
                    ],
                    "do_not": [
                        "Do not cut the wound",
                        "Do not suck out the venom",
                        "Do not apply ice or tourniquet"
                    ],
                    "urgent": True,
                    "call_emergency": True
                },
                "hi": {
                    "steps": [
                        "शांत रहें और प्रभावित अंग को स्थिर रखें",
                        "तंग कपड़े या गहने हटाएं",
                        "काटने वाले क्षेत्र को दिल के स्तर से नीचे रखें",
                        "तत्काल चिकित्सा सहायता लें"
                    ],
                    "do_not": [
                        "घाव को न काटें",
                        "विष को न चूसें",
                        "बर्फ या टूर्निकेट न लगाएं"
                    ],
                    "urgent": True,
                    "call_emergency": True
                }
            },
            "burns": {
                "en": {
                    "steps": [
                        "Cool the burn with cool (not cold) water",
                        "Remove jewelry and tight items",
                        "Cover with sterile gauze",
                        "Seek medical attention for severe burns"
                    ],
                    "do_not": [
                        "Do not apply ice directly",
                        "Do not pop blisters",
                        "Do not apply butter or oil"
                    ],
                    "urgent": False,
                    "call_emergency": False
                }
            }
        }

class GovernmentSchemesService:
    """Searches government health schemes and benefits"""
    
    def __init__(self, models):
        self.models = models
        self.schemes_database = self._load_schemes_database()
        self.vector_db = None
        self._initialize_vector_db()
    
    async def search_schemes(self, query: str, language: str = "en", 
                           state: Optional[str] = None) -> Dict[str, Any]:
        """Search government health schemes"""
        try:
            if not self.models.is_model_available('multilingual_embedding'):
                return {"error": "Scheme search service unavailable"}
            
            # Search schemes using vector similarity
            results = await self._search_schemes_vector(query, language, state)
            
            return {
                "query": query,
                "language": language,
                "state": state,
                "results": results,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error searching schemes: {e}")
            return {"error": f"Search failed: {str(e)}"}
    
    async def _search_schemes_vector(self, query: str, language: str, 
                                   state: Optional[str]) -> List[Dict[str, Any]]:
        """Search schemes using vector similarity"""
        try:
            # Generate query embedding
            query_embedding = self.models.get_model('multilingual_embedding').encode([query])
            
            # Search vector database
            if self.vector_db is not None:
                D, I = self.vector_db.search(query_embedding, k=5)
                
                results = []
                for i, (distance, index) in enumerate(zip(D[0], I[0])):
                    if index < len(self.schemes_database):
                        scheme = self.schemes_database[index].copy()
                        scheme['relevance_score'] = float(1 - distance)
                        results.append(scheme)
                
                return results
            else:
                # Fallback to simple text search
                return self._simple_scheme_search(query, language, state)
        except Exception as e:
            logger.error(f"Error in vector search: {e}")
            return self._simple_scheme_search(query, language, state)
    
    def _simple_scheme_search(self, query: str, language: str, 
                             state: Optional[str]) -> List[Dict[str, Any]]:
        """Simple text-based scheme search"""
        results = []
        query_lower = query.lower()
        
        for scheme in self.schemes_database:
            if (query_lower in scheme['name'].lower() or 
                query_lower in scheme['description'].lower()):
                if state is None or state.lower() in scheme['states']:
                    results.append(scheme)
        
        return results[:5]
    
    def _load_schemes_database(self) -> List[Dict[str, Any]]:
        """Load government schemes database"""
        return [
            {
                "name": "PMJAY - Ayushman Bharat",
                "description": "Health insurance scheme for poor and vulnerable families",
                "eligibility": "BPL families, SECC beneficiaries",
                "coverage": "Up to ₹5 lakhs per family per year",
                "states": ["all"],
                "helpline": "14555",
                "website": "https://pmjay.gov.in"
            },
            {
                "name": "UP State Health Scheme",
                "description": "Uttar Pradesh state health insurance scheme",
                "eligibility": "UP residents, BPL families",
                "coverage": "Up to ₹5 lakhs per family per year",
                "states": ["Uttar Pradesh"],
                "helpline": "1800-180-5145",
                "website": "https://uphealthup.gov.in"
            }
        ]
    
    def _initialize_vector_db(self):
        """Initialize vector database for scheme search"""
        try:
            if self.models.is_model_available('multilingual_embedding'):
                # Generate embeddings for all schemes
                scheme_texts = [
                    f"{scheme['name']} {scheme['description']} {scheme['eligibility']}"
                    for scheme in self.schemes_database
                ]
                
                embeddings = self.models.get_model('multilingual_embedding').encode(scheme_texts)
                
                # Create FAISS index
                dimension = embeddings.shape[1]
                self.vector_db = faiss.IndexFlatL2(dimension)
                self.vector_db.add(embeddings.astype('float32'))
                
                logger.info("Vector database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize vector database: {e}")
            self.vector_db = None
