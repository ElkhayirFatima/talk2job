from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.config import UPLOAD_DIR
from app.core.database import get_db
from app.modules.matching.application.service.matching_service import MatchingService
from app.modules.cv.application.services.parsing_service import ParsingService
from app.modules.matching.domain.schemas.match_schema import (
    MatchRequest,
    MatchResponse,
    RecommendationRequest,
)
from app.modules.matching.domain.schemas.rank_schema import RankingResponse
from app.core.auth.auth_utils import get_current_user

router = APIRouter()


# Dependencies
def get_matching_service(db: Session = Depends(get_db)):
    return MatchingService(db)


def get_parsing_service(db: Session = Depends(get_db)):
    return ParsingService(db)


# --- 1. NEW: Upload CV & Match with specific Job ---
@router.post("/direct-match/{job_id}", response_model=MatchResponse)
async def direct_match(
    job_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    parsing_service: ParsingService = Depends(get_parsing_service),
    match_service: MatchingService = Depends(get_matching_service),
):
    """
    Step 1: Parse the uploaded CV.
    Step 2: Match it immediately with a specific job_id.
    """
    try:
        user_id = current_user.get("id")
        user_name = current_user.get("name")
        resume = await parsing_service.process_resume(
            file, UPLOAD_DIR, user_id, user_name
        )

        # 2. Matching
        return match_service.match_cv_to_job_id(db, resume.id, job_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Direct Match Error: {str(e)}")


# --- 2. NEW: Upload CV & Get Global Recommendations ---
@router.post("/direct-recommend", response_model=RankingResponse)
async def direct_recommend(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    parsing_service: ParsingService = Depends(get_parsing_service),
    match_service: MatchingService = Depends(get_matching_service),
):
    """
    Step 1: Parse the uploaded CV.
    Step 2: Rank all jobs in the DB based on this CV.
    """
    try:
        # 1. Parsing
        user_id = current_user.get("id")
        user_name = current_user.get("name")
        resume = await parsing_service.process_resume(
            file, UPLOAD_DIR, user_id, user_name
        )

        # 2. Global Ranking
        result = await match_service.get_recommendations(db, resume.id)

        if result.get("status") == "Error":
            raise HTTPException(status_code=500, detail=result.get("message"))
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Direct Recommendation Error: {str(e)}"
        )


@router.post("", response_model=MatchResponse)
def match(
    data: MatchRequest,
    db: Session = Depends(get_db),
    service: MatchingService = Depends(get_matching_service),
):
    """
    Analyse 1-vs-1 : Compare un CV avec UN job précis.
    """
    result = service.match_cv_to_job_id(db, data.cv_id, data.job_id)
    if result.get("status") == "Error":
        raise HTTPException(status_code=404, detail=result.get("message"))
    return result


@router.post(
    "/recommend",
    response_model=RankingResponse,
)
async def recommend_jobs(
    data: RecommendationRequest,
    db: Session = Depends(get_db),
    service: MatchingService = Depends(get_matching_service),
):
    """
    Recommandation globale : Cherche les meilleurs jobs dans TOUTE la base.
    """
    # Appel au service de ranking
    result = await service.get_recommendations(db, data.cv_id)

    if result.get("status") == "Error":
        raise HTTPException(status_code=500, detail=result.get("message"))

    return result
