#!/usr/bin/env python3

import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])

def main():
    try:
        # Try to import uvicorn
        import uvicorn
    except ImportError:
        print("Installing uvicorn...")
        install_package('uvicorn')
        import uvicorn

    # Start the server
    if __name__ == "__main__":
        uvicorn.run(
            "students:app",
            host="127.0.0.1",
            port=8000,
            reload=True,
            log_level="info"
        )

if __name__ == "__main__":
    main()
