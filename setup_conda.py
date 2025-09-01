#!/usr/bin/env python3
"""
LUMEN Backend Conda Environment Setup
Automatically sets up conda environment with all required packages
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, check=True, shell=True):
    """Run a shell command and return the result"""
    print(f"Running: {command}")
    try:
        if shell:
            result = subprocess.run(command, shell=True, check=check, capture_output=True, text=True)
        else:
            result = subprocess.run(command.split(), check=check, capture_output=True, text=True)
        
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(result.stderr)
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        return e

def check_conda():
    """Check if conda is available"""
    result = run_command("conda --version", check=False)
    return result.returncode == 0

def create_conda_env():
    """Create the LUMEN backend conda environment"""
    env_name = "lumen_backend"
    
    print(f"Setting up conda environment: {env_name}")
    
    # Check if environment already exists
    result = run_command(f"conda env list | grep {env_name}", check=False)
    if result.returncode == 0:
        print(f"Environment {env_name} already exists. Updating...")
        # Remove existing environment
        run_command(f"conda env remove -n {env_name} -y")
    
    print(f"Creating new conda environment: {env_name}")
    run_command(f"conda create -n {env_name} python=3.9 -y")
    
    return env_name

def install_packages(env_name):
    """Install packages in the conda environment"""
    print(f"Installing packages in {env_name} environment...")
    
    # Install core packages via conda
    conda_packages = [
        "pytorch",
        "torchvision", 
        "torchaudio",
        "cudatoolkit=11.8",
        "numpy",
        "scipy",
        "pillow",
        "opencv",
        "ffmpeg",
        "librosa",
        "soundfile"
    ]
    
    for package in conda_packages:
        print(f"Installing {package} via conda...")
        run_command(f"conda run -n {env_name} conda install -c conda-forge {package} -y")
    
    # Install remaining packages via pip
    pip_packages = [
        "transformers>=4.35.0",
        "datasets>=2.14.0", 
        "accelerate>=0.24.0",
        "sentence-transformers>=2.2.2",
        "faiss-cpu>=1.7.4",
        "fastapi>=0.104.0",
        "uvicorn>=0.24.0",
        "python-multipart>=0.0.6",
        "python-dotenv>=1.0.0",
        "requests>=2.31.0",
        "aiofiles>=0.8.0",
        "pydantic>=2.5.0",
        "PyPDF2>=3.0.0",
        "python-docx>=0.8.11",
        "openpyxl>=3.1.0",
        "pytesseract>=0.3.10"
    ]
    
    print("Installing packages via pip...")
    for package in pip_packages:
        print(f"Installing {package}...")
        run_command(f"conda run -n {env_name} pip install {package}")

def create_environment_yml():
    """Create environment.yml file for conda"""
    env_content = """name: lumen_backend
channels:
  - pytorch
  - conda-forge
  - defaults
dependencies:
  - python=3.9
  - pytorch
  - torchvision
  - torchaudio
  - cudatoolkit=11.8
  - numpy
  - scipy
  - pillow
  - opencv
  - ffmpeg
  - librosa
  - soundfile
  - pip
  - pip:
    - transformers>=4.35.0
    - datasets>=2.14.0
    - accelerate>=0.24.0
    - sentence-transformers>=2.2.2
    - faiss-cpu>=1.7.4
    - fastapi>=0.104.0
    - uvicorn>=0.24.0
    - python-multipart>=0.0.6
    - python-dotenv>=1.0.0
    - requests>=2.31.0
    - aiofiles>=0.8.0
    - pydantic>=2.5.0
    - PyPDF2>=3.0.0
    - python-docx>=0.8.11
    - openpyxl>=3.1.0
    - pytesseract>=0.3.10
"""
    
    with open("environment.yml", "w") as f:
        f.write(env_content)
    
    print("Created environment.yml file")

def create_env_file():
    """Create .env file with configuration"""
    env_content = """# LUMEN Backend Environment Variables

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
"""
    
    with open(".env", "w") as f:
        f.write(env_content)
    
    print("Created .env file")

def create_directories():
    """Create necessary directories"""
    directories = [
        "backend/data/vector_db",
        "backend/data/uploads",
        "backend/logs"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {directory}")

def main():
    """Main setup function"""
    print("🚀 LUMEN Backend Setup")
    print("=" * 50)
    
    # Check if conda is available
    if not check_conda():
        print("❌ Conda is not available. Please install Anaconda or Miniconda first.")
        print("Download from: https://docs.conda.io/en/latest/miniconda.html")
        sys.exit(1)
    
    print("✅ Conda is available")
    
    # Create environment.yml
    create_environment_yml()
    
    # Create directories
    create_directories()
    
    # Create conda environment
    env_name = create_conda_env()
    
    # Install packages
    install_packages(env_name)
    
    # Create .env file
    create_env_file()
    
    print("\n🎉 Setup Complete!")
    print(f"To activate the environment: conda activate {env_name}")
    print("To run the backend: cd backend && python main.py")
    print("\n📋 Next Steps:")
    print("1. Activate the environment: conda activate lumen_backend")
    print("2. Navigate to backend directory: cd backend")
    print("3. Run the server: python main.py")
    print("4. Access the API at: http://localhost:8000")
    print("5. View API docs at: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
