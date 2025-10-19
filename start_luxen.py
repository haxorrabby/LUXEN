#!/usr/bin/env python3
"""
LUXEN Smart Business Manager - Startup Script
This script starts both frontend and backend servers.
"""

import os
import sys
import subprocess
import time
import signal
import threading
from pathlib import Path

class LuxenStarter:
    def __init__(self):
        self.processes = []
        self.running = True
        
    def signal_handler(self, signum, frame):
        """Handle shutdown signals."""
        print("\n🛑 Shutting down LUXEN...")
        self.running = False
        for process in self.processes:
            if process.poll() is None:
                process.terminate()
        sys.exit(0)
    
    def start_backend(self):
        """Start the Python Flask backend."""
        print("🐍 Starting Python Backend...")
        try:
            backend_dir = Path("luxen_backend")
            process = subprocess.Popen([sys.executable, "run.py"], cwd=backend_dir)
            self.processes.append(process)
            print("✅ Backend started on http://localhost:5000")
            return process
        except Exception as e:
            print(f"❌ Failed to start backend: {e}")
            return None
    
    def start_frontend(self):
        """Start the React frontend."""
        print("⚛️  Starting React Frontend...")
        try:
            frontend_dir = Path("luxen_web_app")
            process = subprocess.Popen(["npm", "start"], cwd=frontend_dir, shell=True)
            self.processes.append(process)
            print("✅ Frontend started on http://localhost:3000")
            return process
        except Exception as e:
            print(f"❌ Failed to start frontend: {e}")
            return None
    
    def check_dependencies(self):
        """Check if all dependencies are installed."""
        print("🔍 Checking dependencies...")
        
        # Check if node_modules exists
        if not Path("luxen_web_app/node_modules").exists():
            print("❌ Frontend dependencies not found")
            print("   Run: cd luxen_web_app && npm install")
            return False
        
        # Check if Python dependencies are available
        try:
            import flask
            import firebase_admin
            print("✅ Dependencies check passed")
            return True
        except ImportError as e:
            print(f"❌ Python dependencies missing: {e}")
            print("   Run: cd luxen_backend && pip install -r requirements.txt")
            return False
    
    def run(self):
        """Main run function."""
        print("🚀 LUXEN Smart Business Manager")
        print("=" * 40)
        
        # Set up signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
        # Check dependencies
        if not self.check_dependencies():
            print("\n❌ Dependency check failed. Please install dependencies first.")
            return False
        
        # Start backend
        backend_process = self.start_backend()
        if not backend_process:
            return False
        
        # Wait a bit for backend to start
        time.sleep(3)
        
        # Start frontend
        frontend_process = self.start_frontend()
        if not frontend_process:
            backend_process.terminate()
            return False
        
        print("\n🎉 LUXEN is running!")
        print("📱 Frontend: http://localhost:3000")
        print("🔧 Backend:  http://localhost:5000")
        print("💡 Press Ctrl+C to stop")
        print("=" * 40)
        
        # Monitor processes
        try:
            while self.running:
                time.sleep(1)
                
                # Check if processes are still running
                if backend_process.poll() is not None:
                    print("❌ Backend process stopped unexpectedly")
                    break
                
                if frontend_process.poll() is not None:
                    print("❌ Frontend process stopped unexpectedly")
                    break
                    
        except KeyboardInterrupt:
            pass
        finally:
            # Cleanup
            print("\n🛑 Stopping LUXEN...")
            for process in self.processes:
                if process.poll() is None:
                    process.terminate()
                    process.wait()
            print("✅ LUXEN stopped")

def main():
    """Main function."""
    starter = LuxenStarter()
    success = starter.run()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
