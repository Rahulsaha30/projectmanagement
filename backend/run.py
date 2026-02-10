#!/usr/bin/env python
"""
Simple runner script for the FastAPI application
"""
import uvicorn

if __name__ == "__main__":
    # Run uvicorn with the main app
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

