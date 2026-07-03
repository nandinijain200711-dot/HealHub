from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Application Settings"""
    
    # App Configuration
    APP_NAME: str = "HealHub - AI Healthcare Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    GEMINI_API_KEY: str
    
    # Database Configuration
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "healhub"
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = "sk-"
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    
    # Email Configuration
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "your-email@gmail.com"
    SMTP_PASSWORD: str = "your-app-password"
    SENDER_EMAIL: str = "noreply@healhub.com"
    SENDER_NAME: str = "HealHub Support"
    
    # Google Meet Configuration
    GOOGLE_MEET_LINK: str = "https://meet.google.com/abc-defg-hij"
    
    # Frontend Configuration
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"
    
    # Admin Configuration
    ADMIN_EMAIL: str = "admin@healhub.com"
    ADMIN_PASSWORD: str = "admin-password-change-this"
    ADMIN_USERNAME: str = "admin"
    
    # Security Configuration
    ALLOWED_HOSTS: list = ["*"]
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds
    
    model_config = ConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()
