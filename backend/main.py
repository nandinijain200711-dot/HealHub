from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api import auth, chatbot, appointments, content, users, admin
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Healthcare Web Application",
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

print("CORS_ORIGINS =", settings.CORS_ORIGINS)
print("TYPE =", type(settings.CORS_ORIGINS))

# ==================== Middleware ====================

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZIP Middleware for compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


# ==================== Events ====================

@app.on_event("startup")
async def startup_db_client():
    """Connect to MongoDB on startup"""
    await connect_to_mongo()
    print("🚀 Application started successfully!")


@app.on_event("shutdown")
async def shutdown_db_client():
    """Close MongoDB connection on shutdown"""
    await close_mongo_connection()


# ==================== Routes ====================

# Include API routes
app.include_router(auth.router)
app.include_router(chatbot.router)
app.include_router(appointments.router)
app.include_router(content.router)
app.include_router(users.router)
app.include_router(admin.router)


# ==================== Health Check ====================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "HealHub API - AI-Powered Healthcare Platform",
        "version": settings.APP_VERSION,
        "docs": "/api/docs",
        "redoc": "/api/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


# ==================== Exception Handlers ====================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
