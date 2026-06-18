from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.modules.cv.presentation.routes import parsing_routes
from app.modules.job.presentation.routes import job_routes
from app.modules.matching.presentation.routes import match_routes
from app.modules.notifications.presentation.routes.notif_routes import (
    router as notif_router,
)

app = FastAPI(
    title="Talk2Job API", description="AI-Powered Job Matching System", version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Parsing module (CV Parsing)
app.include_router(parsing_routes.router, prefix="/api/parsing", tags=["Parsing"])
# Job module (Scraping, Listing)
app.include_router(job_routes.router, prefix="/api/jobs", tags=["Jobs"])

# Matching module (CV-Job Matching)
app.include_router(match_routes.router, prefix="/api/matches", tags=["Matches"])

# Notifications module (User Notifications)
app.include_router(notif_router, prefix="/api/notifications", tags=["Notifications"])


# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to Talk2Job API", "status": "Online"}
