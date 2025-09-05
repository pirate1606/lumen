#!/usr/bin/env python3
"""
LUMEN Backend Setup Script
Sets up conda environment and installs all required packages for Hugging Face models
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, check=True):
    """Run a shell command and return the result"""
    print(f"Running: {command}")
    try:
        result = subprocess.run(command, shell=True, check=check, capture_output=True, text=True)
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
    
    # Check if environment already exists
    result = run_command(f"conda env list | grep {env_name}", check=False)
    if result.returncode == 0:
        print(f"Environment {env_name} already exists. Updating...")
        run_command(f"conda env update -f environment.yml")
    else:
        print(f"Creating new conda environment: {env_name}")
        run_command(f"conda create -n {env_name} python=3.9 -y")
    
    return env_name

def install_packages(env_name):
    """Install packages in the conda environment"""
    print(f"Installing packages in {env_name} environment...")
    
    # Activate environment and install packages
    commands = [
        f"conda activate {env_name}",
        "pip install --upgrade pip",
        "pip install -r backend_requirements.txt"
    ]
    
    for cmd in commands:
        if cmd.startswith("conda activate"):
            # For conda activate, we need to run in a shell
            run_command(f"conda run -n {env_name} pip install --upgrade pip")
        else:
            run_command(f"conda run -n {env_name} {cmd}")

def create_environment_yml():
    """Create environment.yml file for conda"""
    env_content = """name: lumen_backend
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.9
  - pip
  - pip:
    - -r backend_requirements.txt
"""
    
    with open("environment.yml", "w") as f:
        f.write(env_content)
    
    print("Created environment.yml file")

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
    
    # Create conda environment
    env_name = create_conda_env()
    
    # Install packages
    install_packages(env_name)
    
    print("\n🎉 Setup Complete!")
    print(f"To activate the environment: conda activate {env_name}")
    print("To run the backend: python backend/main.py")
    
    # Create .env template
    create_env_template()

def create_env_template():
    """Create .env template file"""
    env_template = """# LUMEN Backend Environment Variables
# Copy this to .env and fill in your values

# Hugging Face API Key

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
    
    with open(".env.template", "w") as f:
        f.write(env_template)
    
    print("Created .env.template file")

if __name__ == "__main__":
    main()
