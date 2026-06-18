from pydantic import BaseModel
from typing import List, Optional

# --- LES INPUTS (Ce que l'utilisateur envoie) ---


class MatchRequest(BaseModel):
    """Pour comparer un CV à UN job spécifique"""

    job_id: str
    cv_id: str


class RecommendationRequest(BaseModel):
    """Pour obtenir des recommandations parmi TOUS les jobs"""

    cv_id: str


# --- LES OUTPUTS (Ce que le serveur répond) ---
class MatchBreakdown(BaseModel):
    summary_semantic: float
    core_skills_semantic: float
    secondary_skills_semantic: float


class MatchResponse(BaseModel):
    match_score: float
    status: str = "Success"

    difficulty_level: str  # (Ideal Match, Challenging, Overqualified)
    insight_message: str

    breakdown: MatchBreakdown

    job_skills: List[str] = []
    cv_skills: List[str] = []
