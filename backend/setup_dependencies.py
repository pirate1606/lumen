#!/usr/bin/env python3
"""
LUMEN Backend Dependency Setup Script
Installs missing dependencies and fixes common issues
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        if e.stdout:
            print(f"STDOUT: {e.stdout}")
        if e.stderr:
            print(f"STDERR: {e.stderr}")
        return False

def main():
    """Main setup function"""
    print("🚀 LUMEN Backend Dependency Setup")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 9):
        print("❌ Python 3.9+ required. Current version:", sys.version)
        sys.exit(1)
    
    print(f"✅ Python version: {sys.version}")
    
    # Upgrade pip
    run_command("python -m pip install --upgrade pip", "Upgrading pip")
    
    # Install protobuf first (fixes many model loading issues)
    print("🔧 Installing protobuf (required for model loading)...")
    run_command("pip install protobuf>=4.21.0", "Installing protobuf")
    
    # Install core requirements
    print("📦 Installing core requirements...")
    run_command("pip install -r ../backend_requirements.txt", "Installing requirements")
    
    # Install additional dependencies that might be missing
    additional_deps = [
        "tokenizers>=0.15.0",
        "huggingface-hub>=0.19.0",
        "accelerate>=0.24.0"
    ]
    
    for dep in additional_deps:
        run_command(f"pip install {dep}", f"Installing {dep}")
    
    # Create data directories if they don't exist
    print("📁 Creating data directories...")
    data_dirs = ["data", "data/uploads", "data/vector_db"]
    for dir_path in data_dirs:
        os.makedirs(dir_path, exist_ok=True)
        print(f"✅ Created directory: {dir_path}")
    
    print("\n🎉 Setup completed!")
    print("\n📝 Next steps:")
    print("1. Copy 'env_example.txt' to '.env' and set your HF_API_KEY")
    print("2. Run 'python main.py' to start the server")
    print("3. The server will run on http://localhost:8000")
    
    print("\n🔑 To get a HuggingFace API key:")
    print("   - Go to https://huggingface.co/settings/tokens")
    print("   - Create a new token")
    print("   - Add it to your .env file")

if __name__ == "__main__":
    main()
