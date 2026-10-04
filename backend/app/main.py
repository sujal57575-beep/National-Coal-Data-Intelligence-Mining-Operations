import os
import traceback
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes import api_router
from database.seed.seed_data import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise AI/ML-Powered Geological, Mining & Production Data Intelligence and Automated Reporting Platform for CMPDI/CIL & Ministry of Coal.",
    version=settings.PROJECT_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    print("Starting CMPDI/CIL AI Platform Backend...")
    try:
        seed_database()
    except Exception as e:
        print(f"Startup seed notice: {e}")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global graceful error handler preventing raw stack traces from reaching users (Section 46).
    """
    print(f"Internal Error on {request.method} {request.url}: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Processing Error",
            "message": "The system encountered an error while processing your request. Please contact technical audit support.",
            "timestamp": request.state.__dict__.get("start_time", None)
        }
    )

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "organization": "CMPDI / Coal India Limited / Ministry of Coal",
        "api_docs": "/docs",
        "health_check": "/api/health",
        "version": settings.PROJECT_VERSION
    }
