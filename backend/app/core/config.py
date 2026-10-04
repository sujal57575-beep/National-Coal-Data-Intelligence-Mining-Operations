import os
from pydantic import BaseModel
from typing import List, Optional

class Settings(BaseModel):
    PROJECT_NAME: str = "CMPDI/CIL AI Geological & Mining Intelligence Platform"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cmpdi-cil-super-secret-production-key-2026-secure-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database: Supports SQLite (for immediate turnkey demo) and PostgreSQL / pgvector
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cmpdi_platform.db")
    
    # Redis / Async Queue
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)
    
    # AI Router Configuration
    # Policies: LOCAL_ONLY, PRIVATE_CLOUD, APPROVED_CLOUD
    DATA_GOVERNANCE_POLICY: str = os.getenv("DATA_GOVERNANCE_POLICY", "LOCAL_ONLY")
    LOCAL_MODEL_NAME: str = os.getenv("LOCAL_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
    CLOUD_LLM_ENABLED: bool = os.getenv("CLOUD_LLM_ENABLED", "false").lower() == "true"
    CLOUD_LLM_API_KEY: Optional[str] = os.getenv("CLOUD_LLM_API_KEY", None)
    CLOUD_LLM_MODEL: str = os.getenv("CLOUD_LLM_MODEL", "gemini-2.5-pro")
    
    # Storage
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./storage")
    UPLOAD_DIR: str = os.path.join(os.getenv("STORAGE_DIR", "./storage"), "uploads")
    PROCESSED_DIR: str = os.path.join(os.getenv("STORAGE_DIR", "./storage"), "processed")
    REPORTS_DIR: str = os.path.join(os.getenv("STORAGE_DIR", "./storage"), "reports")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

settings = Settings()

# Ensure directories exist
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.PROCESSED_DIR, exist_ok=True)
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
