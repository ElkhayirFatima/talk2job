from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.modules.job.domain.schemas.job_schema import JobResponse


class NotificationResponse(BaseModel):
    """
    Pydantic schema for sending notification data to the Frontend.
    Includes nested Job details.
    """

    id: int
    job_id: str
    match_score: float
    insight_message: str
    is_read: bool
    created_at: datetime

    # Nested Job data (from JobRead schema)
    job: JobResponse

    class Config:
        # Allows Pydantic to read data from SQLAlchemy objects
        from_attributes = True


class UnreadCount(BaseModel):
    """Schema for returning the count of unread notifications"""

    unread_count: int
