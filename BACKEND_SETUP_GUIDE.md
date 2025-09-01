# LUMEN Backend Setup Guide

## 🚀 Complete Backend Setup with Hugging Face Models

This guide will help you set up the LUMEN backend with all the required AI models and dependencies.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Python**: 3.9 or higher
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **GPU**: Optional but recommended for faster inference (CUDA 11.8+)

### Required Software
1. **Anaconda or Miniconda** - [Download here](https://docs.conda.io/en/latest/miniconda.html)
2. **Git** - [Download here](https://git-scm.com/downloads)

## 🔧 Quick Setup (Automated)

### Option 1: Automated Setup Script
```bash
# Run the automated setup script
python setup_conda.py
```

### Option 2: Manual Setup
Follow the step-by-step instructions below.

## 📦 Manual Setup Steps

### Step 1: Clone and Navigate to Project
```bash
cd /path/to/LUMEN-OpenAIxNXTWave_Project
```

### Step 2: Create Conda Environment
```bash
# Create new environment
conda create -n lumen_backend python=3.9 -y

# Activate environment
conda activate lumen_backend
```

### Step 3: Install Core Dependencies via Conda
```bash
# Install PyTorch and core packages
conda install -c pytorch -c conda-forge pytorch torchvision torchaudio cudatoolkit=11.8 -y

# Install additional packages
conda install -c conda-forge numpy scipy pillow opencv ffmpeg librosa soundfile -y
```

### Step 4: Install Python Packages via Pip
```bash
# Install Hugging Face and ML packages
pip install transformers>=4.35.0 datasets>=2.14.0 accelerate>=0.24.0 sentence-transformers>=2.2.2

# Install vector database
pip install faiss-cpu>=1.7.4

# Install web framework
pip install fastapi>=0.104.0 uvicorn>=0.24.0 python-multipart>=0.0.6

# Install utilities
pip install python-dotenv>=1.0.0 requests>=2.31.0 aiofiles>=0.8.0 pydantic>=2.5.0

# Install document processing
pip install PyPDF2>=3.0.0 python-docx>=0.8.11 openpyxl>=3.1.0 pytesseract>=0.3.10
```

### Step 5: Create Environment File
Create a `.env` file in the project root:
```bash
# LUMEN Backend Environment Variables

# Hugging Face API Key
HF_API_KEY=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

# Model Configuration
INDIC_GPT_MODEL=ai4bharat/indic-gpt
WHISPER_MODEL=openai/whisper-small
XTTS_MODEL=coqui/XTTS-v2
DONUT_MODEL=naver-clova-ix/donut-base-finetuned-docvqa
BLIP_MODEL=Salesforce/blip-image-captioning-base
EMBEDDING_MODEL=sentence-transformers/all-mpnet-base-v2
MULTILINGUAL_EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Vector Database
VECTOR_DB_PATH=./data/vector_db
```

### Step 6: Create Required Directories
```bash
mkdir -p backend/data/vector_db
mkdir -p backend/data/uploads
mkdir -p backend/logs
```

## 🤖 Hugging Face Models Overview

### 1. **Multilingual Chatbot** - `ai4bharat/indic-gpt`
- **Purpose**: Core conversations in Indian languages
- **Features**: Handles English + 12+ Indian languages
- **Use Case**: Symptom analysis, triage guidance, general healthcare Q&A

### 2. **Speech Recognition** - `openai/whisper-small`
- **Purpose**: Convert speech to text for Indian languages
- **Features**: Multilingual ASR, works well with Indian accents
- **Use Case**: Voice input for symptoms and commands

### 3. **Text-to-Speech** - `coqui/XTTS-v2`
- **Purpose**: Convert text to speech in Indian languages
- **Features**: Multilingual TTS, supports Hindi, Tamil, Bengali, etc.
- **Use Case**: LUMEN speaking back to users

### 4. **Lab Report Analysis** - `naver-clova-ix/donut-base-finetuned-docvqa`
- **Purpose**: Extract information from lab reports
- **Features**: OCR + document understanding
- **Use Case**: Parse PDFs/images, extract values, provide analysis

### 5. **Dermatology Analysis** - `Salesforce/blip-image-captioning-base`
- **Purpose**: Analyze skin condition images
- **Features**: Image captioning and analysis
- **Use Case**: Skin rash, lesion, burn analysis

### 6. **Knowledge Retrieval** - `sentence-transformers/all-mpnet-base-v2`
- **Purpose**: Emergency knowledge and guidelines
- **Features**: High-quality embeddings for retrieval
- **Use Case**: First aid, emergency procedures

### 7. **Multilingual Search** - `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`
- **Purpose**: Government schemes search in Indian languages
- **Features**: Multilingual embeddings
- **Use Case**: Health benefits, insurance schemes

## 🚀 Running the Backend

### Start the Server
```bash
# Activate environment
conda activate lumen_backend

# Navigate to backend directory
cd backend

# Run the server
python main.py
```

### Access Points
- **API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## 🔌 API Endpoints

### Chatbot & Symptoms
- `POST /api/chat/symptoms` - Symptom-based diagnosis
- `POST /api/chat/general` - General healthcare conversation

### Voice Processing
- `POST /api/voice/speech-to-text` - Convert speech to text
- `POST /api/voice/text-to-speech` - Convert text to speech

### Lab Analysis
- `POST /api/lab/analyze` - Analyze lab reports

### Dermatology
- `POST /api/dermatology/analyze` - Analyze skin conditions

### Emergency Education
- `POST /api/emergency/guide` - Get first aid guides
- `GET /api/emergency/types` - List emergency types

### Government Schemes
- `POST /api/government/schemes` - Search health schemes
- `GET /api/government/states` - List supported states

### System Information
- `GET /api/models/info` - Model information
- `GET /api/health` - Health check

## 🔧 Configuration Options

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `HF_API_KEY` | Hugging Face API key | Required |
| `HOST` | Server host | 0.0.0.0 |
| `PORT` | Server port | 8000 |
| `DEBUG` | Debug mode | true |
| `VECTOR_DB_PATH` | Vector database path | ./data/vector_db |

### Model Configuration
You can customize which models to use by modifying the `.env` file:
```bash
# Use different models
INDIC_GPT_MODEL=your-preferred-chatbot-model
WHISPER_MODEL=your-preferred-asr-model
# ... etc
```

## 🧪 Testing the Setup

### Test Model Loading
```bash
# Activate environment
conda activate lumen_backend

# Navigate to backend
cd backend

# Test model loading
python -c "
from lumen_models import LumenModels
models = LumenModels()
print('Available models:', models.get_available_models())
print('Device info:', models.get_device_info())
"
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8000/api/health

# Model info
curl http://localhost:8000/api/models/info
```

## 🐛 Troubleshooting

### Common Issues

#### 1. CUDA/GPU Issues
```bash
# Check CUDA availability
python -c "import torch; print('CUDA available:', torch.cuda.is_available())"

# Install CPU-only version if needed
pip uninstall torch torchvision torchaudio
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

#### 2. Memory Issues
```bash
# Reduce model precision
export TORCH_DTYPE=float16

# Use smaller models
export WHISPER_MODEL=openai/whisper-tiny
export BLIP_MODEL=Salesforce/blip-image-captioning-base
```

#### 3. Package Conflicts
```bash
# Clean environment
conda deactivate
conda env remove -n lumen_backend
conda create -n lumen_backend python=3.9 -y
conda activate lumen_backend

# Reinstall packages
pip install -r backend_requirements.txt
```

#### 4. Hugging Face API Issues
```bash
# Check API key
echo $HF_API_KEY

# Test API access
curl -H "Authorization: Bearer $HF_API_KEY" \
     https://api-inference.huggingface.co/models/ai4bharat/indic-gpt
```

### Performance Optimization

#### GPU Acceleration
```bash
# Install CUDA toolkit
conda install -c conda-forge cudatoolkit=11.8

# Verify GPU support
python -c "
import torch
print('CUDA:', torch.cuda.is_available())
print('Device:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')
"
```

#### Memory Management
```bash
# Set memory limits
export PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128

# Use gradient checkpointing
export TRANSFORMERS_GRADIENT_CHECKPOINTING=true
```

## 📚 Additional Resources

### Documentation
- [Hugging Face Transformers](https://huggingface.co/docs/transformers/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PyTorch Documentation](https://pytorch.org/docs/)
- [FAISS Documentation](https://github.com/facebookresearch/faiss)

### Community Support
- [Hugging Face Forums](https://discuss.huggingface.co/)
- [FastAPI Community](https://github.com/tiangolo/fastapi/discussions)
- [PyTorch Community](https://discuss.pytorch.org/)

## 🔒 Security Considerations

### API Security
- Keep your Hugging Face API key secure
- Use environment variables, never hardcode keys
- Implement rate limiting for production use
- Add authentication for sensitive endpoints

### Data Privacy
- All processing is done locally
- No patient data is stored permanently
- Temporary files are cleaned up after processing
- Implement proper data handling policies

## 🚀 Production Deployment

### Docker Setup
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["python", "backend/main.py"]
```

### Environment Management
```bash
# Production environment
export NODE_ENV=production
export DEBUG=false
export HOST=0.0.0.0
export PORT=8000
```

---

## 🎉 Setup Complete!

Your LUMEN backend is now ready with:
- ✅ Conda environment with all dependencies
- ✅ Hugging Face models for healthcare AI
- ✅ FastAPI server with comprehensive endpoints
- ✅ Multilingual support for Indian languages
- ✅ Vector database for knowledge retrieval
- ✅ Document analysis capabilities
- ✅ Voice processing (ASR/TTS)
- ✅ Emergency education system
- ✅ Government schemes assistant

**Next Steps:**
1. Test the API endpoints
2. Integrate with your frontend
3. Customize models as needed
4. Deploy to production

For support, check the troubleshooting section or create an issue in the project repository.
