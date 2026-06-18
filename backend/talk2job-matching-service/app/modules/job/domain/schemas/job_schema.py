from pydantic import BaseModel, ConfigDict
from typing import Optional
from enum import Enum

from datetime import datetime


class JobResponse(BaseModel):
    id: int
    job_id: str
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    job_url: Optional[str] = None
    is_active: Optional[bool] = None
    last_checked_at: Optional[datetime] = None
    description: Optional[str] = None
    core_skills: Optional[str] = None
    secondary_skills: Optional[str] = None
    job_summary: Optional[str] = None
    seniority_level: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SeniorityEnum(str, Enum):
    junior = "Junior"
    mid = "Mid-level"
    senior = "Senior"


class CountryEnum(str, Enum):
    MOROCCO = "Morocco"
    FRANCE = "France"
    USA = "USA"
    SPAIN = "Spain"
    GERMANY = "Germany"
    UK = "United Kingdom"
    CANADA = "Canada"
    UAE = "UAE"
