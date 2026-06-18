from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ResumeResponse(BaseModel):
    id: int
    user_id: str
    user_name: Optional[str] = None
    file_hash: str
    is_active: bool
    filename: str
    file_path: str
    # Optional fields in case the extraction was partial
    raw_text: Optional[str] = None
    core_skills: Optional[str] = None
    secondary_skills: Optional[str] = None
    cv_summary: Optional[str] = None
    seniority_level: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
