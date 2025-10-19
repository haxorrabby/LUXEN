#!/usr/bin/env python3
"""
LUXEN Smart Business Manager - Setup Test Script
This script tests if all components are properly configured.
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def check_node_version():
    """Check if Node.js is installed and compatible."""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ Node.js {version} is installed")
            return True
    except FileNotFoundError:
        pass
    print("❌ Node.js is not installed or not in PATH")
    return False

def check_firebase_config():
    """Check if Firebase configuration files exist."""
    backend_key = Path("luxen_backend/serviceAccountKey.json")
    frontend_config = Path("luxen_web_app/src/config/firebase.js")
    
    if backend_key.exists():
        print("✅ Backend Firebase service account key found")
    else:
        print("❌ Backend Firebase service account key not found")
        print("   Please download serviceAccountKey.json and place in luxen_backend/")
    
    if frontend_config.exists():
        print("✅ Frontend Firebase configuration found")
    else:
        print("❌ Frontend Firebase configuration not found")
    
    return backend_key.exists() and frontend_config.exists()

def check_dependencies():
    """Check if required dependencies are installed."""
    print("\n🔍 Checking dependencies...")
    
    # Check Python dependencies
    try:
        import flask
        import firebase_admin
        print("✅ Python dependencies are installed")
    except ImportError as e:
        print(f"❌ Python dependencies missing: {e}")
        print("   Run: cd luxen_backend && pip install -r requirements.txt")
        return False
    
    # Check Node.js dependencies
    node_modules = Path("luxen_web_app/node_modules")
    if node_modules.exists():
        print("✅ Node.js dependencies are installed")
    else:
        print("❌ Node.js dependencies not found")
        print("   Run: cd luxen_web_app && npm install")
        return False
    
    return True

def check_environment_files():
    """Check if environment files exist."""
    print("\n🔍 Checking environment configuration...")
    
    backend_env = Path("luxen_backend/.env")
    frontend_env = Path("luxen_web_app/.env")
    
    if backend_env.exists():
        print("✅ Backend environment file found")
    else:
        print("⚠️  Backend environment file not found")
        print("   Create luxen_backend/.env with your configuration")
    
    if frontend_env.exists():
        print("✅ Frontend environment file found")
    else:
        print("⚠️  Frontend environment file not found")
        print("   Create luxen_web_app/.env with your Firebase configuration")
    
    return True

def test_backend_imports():
    """Test if backend can be imported without errors."""
    print("\n🔍 Testing backend imports...")
    
    try:
        sys.path.append("luxen_backend")
        from app import create_app
        print("✅ Backend imports successful")
        return True
    except Exception as e:
        print(f"❌ Backend import error: {e}")
        return False

def test_frontend_build():
    """Test if frontend can be built."""
    print("\n🔍 Testing frontend build...")
    
    try:
        os.chdir("luxen_web_app")
        result = subprocess.run(['npm', 'run', 'build'], 
                              capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            print("✅ Frontend build successful")
            return True
        else:
            print(f"❌ Frontend build failed: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        print("❌ Frontend build timed out")
        return False
    except Exception as e:
        print(f"❌ Frontend build error: {e}")
        return False
    finally:
        os.chdir("..")

def main():
    """Main test function."""
    print("🚀 LUXEN Smart Business Manager - Setup Test")
    print("=" * 50)
    
    tests = [
        ("Python Version", check_python_version),
        ("Node.js Version", check_node_version),
        ("Firebase Configuration", check_firebase_config),
        ("Dependencies", check_dependencies),
        ("Environment Files", check_environment_files),
        ("Backend Imports", test_backend_imports),
        ("Frontend Build", test_frontend_build),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with error: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\n🎯 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your LUXEN setup is ready to go!")
        print("\n🚀 To start the application:")
        print("   npm run dev")
        print("\n📖 For detailed setup instructions, see README.md")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please fix the issues above.")
        print("\n📖 For troubleshooting, see SETUP_INSTRUCTIONS.md")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
