#!/usr/bin/env python3
"""
LUMEN Backend API Test Script
Tests all working endpoints to verify functionality
"""

import requests
import json
import time

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🏥 Testing Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print(f"✅ Health check passed: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_chat_endpoint():
    """Test the chat endpoint"""
    print("\n💬 Testing Chat Endpoint...")
    try:
        data = {
            "message": "Hello, I have a headache. What should I do?",
            "language": "en",
            "context": "Patient complaining of headache"
        }
        response = requests.post(f"{BASE_URL}/api/chat/symptoms", json=data)
        if response.status_code == 200:
            print(f"✅ Chat endpoint working: {response.json()}")
            return True
        else:
            print(f"❌ Chat endpoint failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Chat endpoint error: {e}")
        return False

def test_voice_endpoint():
    """Test the voice endpoint"""
    print("\n🎤 Testing Voice Endpoint...")
    try:
        data = {
            "language": "en",
            "text": "Hello, this is a test message for text to speech conversion."
        }
        response = requests.post(f"{BASE_URL}/api/voice/tts", json=data)
        if response.status_code == 200:
            print(f"✅ Voice endpoint working: {response.json()}")
            return True
        else:
            print(f"❌ Voice endpoint failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Voice endpoint error: {e}")
        return False

def test_lab_analysis_endpoint():
    """Test the lab analysis endpoint"""
    print("\n🔬 Testing Lab Analysis Endpoint...")
    try:
        data = {
            "language": "en",
            "patient_age": 30,
            "patient_gender": "female"
        }
        response = requests.post(f"{BASE_URL}/api/lab/analyze", json=data)
        if response.status_code == 200:
            print(f"✅ Lab analysis endpoint working: {response.json()}")
            return True
        else:
            print(f"❌ Lab analysis endpoint failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Lab analysis endpoint error: {e}")
        return False

def test_emergency_endpoint():
    """Test the emergency endpoint"""
    print("\n🚨 Testing Emergency Endpoint...")
    try:
        data = {
            "emergency_type": "snakebite",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/api/emergency/guide", json=data)
        if response.status_code == 200:
            print(f"✅ Emergency endpoint working: {response.json()}")
            return True
        else:
            print(f"❌ Emergency endpoint failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Emergency endpoint error: {e}")
        return False

def test_government_schemes_endpoint():
    """Test the government schemes endpoint"""
    print("\n🏛️ Testing Government Schemes Endpoint...")
    try:
        data = {
            "query": "healthcare benefits for senior citizens",
            "language": "en",
            "state": "Maharashtra"
        }
        response = requests.post(f"{BASE_URL}/api/govt/schemes", json=data)
        if response.status_code == 200:
            print(f"✅ Government schemes endpoint working: {response.json()}")
            return True
        else:
            print(f"❌ Government schemes endpoint failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Government schemes endpoint error: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 LUMEN Backend API Testing")
    print("=" * 50)
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(5)
    
    # Test all endpoints
    tests = [
        test_health_endpoint,
        test_chat_endpoint,
        test_voice_endpoint,
        test_lab_analysis_endpoint,
        test_emergency_endpoint,
        test_government_schemes_endpoint
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"🎯 Test Results: {passed}/{total} endpoints working")
    
    if passed == total:
        print("🎉 All endpoints are working perfectly!")
    elif passed > total / 2:
        print("✅ Most endpoints are working!")
    else:
        print("⚠️ Some endpoints need attention")
    
    print(f"\n🌐 Server running on: {BASE_URL}")
    print("📚 API documentation available at: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
