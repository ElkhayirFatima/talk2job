from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.config import UPLOAD_DIR
from app.core.database import get_db
from app.modules.cv.domain.schemas.resume_schema import ResumeResponse
from app.modules.cv.application.services.parsing_service import ParsingService
from app.modules.cv.application.services.resume_service import ResumeService
from app.core.auth.auth_utils import get_current_user

router = APIRouter()


# Dependency Injection helpers
def get_parsing_service(db: Session = Depends(get_db)):
    return ParsingService(db)


def get_resume_service(db: Session = Depends(get_db)):
    return ResumeService(db)


@router.post("/parse", response_model=ResumeResponse)
async def parse_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    service: ParsingService = Depends(get_parsing_service),
):
    """
    Upload a CV, hash it to prevent duplicates, extract info with AI,
    and set it as the ACTIVE resume for the user.
    """
    try:
        user_id = current_user.get("id")
        user_name = current_user.get("name")
        # Pass user_id to handle deduplication and active status logic
        return await service.process_resume(file, UPLOAD_DIR, user_id, user_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id}", response_model=ResumeResponse)
def get_resume(id: int, service: ResumeService = Depends(get_resume_service)):
    """Get details of a specific resume by ID."""
    resume = service.get_resume(id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.get("/user/{user_id}", response_model=List[ResumeResponse])
def get_user_resumes(
    user_id: str, service: ResumeService = Depends(get_resume_service)
):
    """
    Get all resumes uploaded by a specific user.
    Note: Returns a list [ResumeResponse, ...]
    """
    resumes = service.list_user_resumes(user_id)
    if not resumes:
        # Return empty list instead of 404 if user has no resumes yet
        return []
    return resumes


@router.patch("/{id}/activate", response_model=ResumeResponse)
def activate_resume(
    id: int,
    current_user: dict = Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service),
):
    """
    Switch the 'Active' status to this resume.
    Used for semantic matching with jobs.
    """
    user_id = current_user.get("id") if isinstance(current_user, dict) else current_user
    resume = service.activate_resume(user_id, id)
    if not resume:
        raise HTTPException(
            status_code=404, detail="Resume not found or doesn't belong to user"
        )
    return resume


@router.delete("/{id}")
def delete_resume(
    id: int,
    current_user: dict = Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service),
):
    """Delete resume from database and remove the physical file."""
    user_id = current_user.get("id") if isinstance(current_user, dict) else current_user
    success = service.delete_resume(id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Resume deleted successfully"}
