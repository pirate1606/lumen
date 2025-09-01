# LUMEN Backend Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
python setup_dependencies.py
```

### 2. Set Environment Variables
```bash
# Copy the example file
cp env_example.txt .env

# Edit .env and add your HuggingFace API key
# Get one from: https://huggingface.co/settings/tokens
```

### 3. Start the Server
```bash
python main.py
```

The server will run on `http://localhost:8000` with minimal logging noise.

## 🔧 What Was Fixed

- ✅ **Model Loading Errors**: Replaced broken models with working alternatives
- ✅ **Missing Dependencies**: Added protobuf, tokenizers, and huggingface-hub
- ✅ **Verbose Logging**: Reduced noise from transformers and other libraries
- ✅ **Better Error Handling**: Graceful fallbacks when models fail to load

## 📋 Working Models

| Feature | Model | Status |
|---------|-------|--------|
| Chatbot | microsoft/DialoGPT-medium | ✅ Working |
| Speech-to-Text | openai/whisper-small | ✅ Working |
| Text-to-Speech | facebook/fastspeech2-en-ljspeech | ✅ Working |
| Document OCR | naver-clova-ix/donut-base-finetuned-cord-v2 | ✅ Working |
| Image Captioning | Salesforce/blip-image-captioning-base | ✅ Working |
| Embeddings | sentence-transformers/all-mpnet-base-v2 | ✅ Working |

## 🐛 Troubleshooting

### If you still see errors:
1. **Check Python version**: Must be 3.9+
2. **Install protobuf**: `pip install protobuf>=4.21.0`
3. **Clear cache**: `pip cache purge`
4. **Restart terminal**: Sometimes needed after installing new packages

### Common Issues:
- **"protobuf not found"**: Run `python setup_dependencies.py`
- **"model not found"**: Check your internet connection
- **"CUDA errors"**: Models will automatically fall back to CPU

## 📱 Test the API

Once running, test with:
```bash
curl http://localhost:8000/api/health
```

Should return: `{"status": "healthy", "service": "LUMEN Backend"}`

## 🎯 Next Steps

1. **Frontend Integration**: Connect to your React app
2. **Custom Models**: Add your own models in `.env`
3. **Production**: Deploy with proper environment variables
4. **Monitoring**: Add logging and health checks

## 📞 Support

- Check the logs for specific error messages
- Verify all dependencies are installed
- Ensure you have a stable internet connection for model downloads
