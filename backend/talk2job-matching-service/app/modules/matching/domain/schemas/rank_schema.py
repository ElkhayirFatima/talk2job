from pydantic import BaseModel, Field
from typing import List, Optional


class SearchCriteria(BaseModel):
    """Metadata about the search parameters used"""

    min_score_applied: float
    total_found: int


class JobRelevance(BaseModel):
    """Schema for a single ranked job result"""

    job_id: str
    title: str
    company: Optional[str] = "N/A"
    location: Optional[str] = "N/A"
    ranking_score: float = Field(
        ..., description="Score final calculé par FlashRank (0-100)"
    )
    difficulty_level: str  # (Ideal Match, Challenging, Overqualified)
    insight_message: str
    summary: str
    posted_at: Optional[str] = "N/A"
    job_url: Optional[str] = "#"


class RankingResponse(BaseModel):
    """Schema for the final API response"""

    status: str
    search_criteria: SearchCriteria
    recommendations: List[JobRelevance]
