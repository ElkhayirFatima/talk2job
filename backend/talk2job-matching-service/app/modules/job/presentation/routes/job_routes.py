from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional

from app.core.database import SessionLocal
from app.modules.job.domain.schemas.job_schema import (
    JobResponse,
    SeniorityEnum,
    CountryEnum,
)
from app.modules.job.application.fetcher.job_fetcher import fetch_all_jobs
from app.modules.job.infrastructure.repository.job_repository import JobRepository
from app.modules.job.application.use_cases.job_use_case import save_jobs

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[JobResponse])
def list_jobs(
    title: Optional[str] = None,
    city: Optional[str] = None,
    country: Optional[CountryEnum] = None,
    seniority: Optional[SeniorityEnum] = None,
    is_remote: Optional[bool] = None,
    company: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Fetch jobs with optional filters.
    Example: /api/v1/jobs?city=Rabat&seniority=Senior
    """
    repository = JobRepository(db)
    return repository.get_jobs(
        title=title,
        city=city,
        country=country,
        seniority=seniority,
        is_remote=is_remote,
        company=company,
    )


@router.post("/sync")
async def sync_jobs_endpoint(
    background_tasks: BackgroundTasks, db: Session = Depends(get_db)
):

    def do_sync():
        jobs = fetch_all_jobs()
        save_jobs(db, jobs)
        print("Sync complete!")

    background_tasks.add_task(do_sync)
    return {"message": "Scraping started in background. This might take a few minutes."}


@router.get("/companies", response_model=list[str])
def list_unique_companies(db: Session = Depends(get_db)):
    repository = JobRepository(db)
    return repository.get_unique_companies()


@router.get("/{id}", response_model=JobResponse)
def read_job(id: int, db: Session = Depends(get_db)):
    repository = JobRepository(db)
    job = repository.get_job_by_id(id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found in our records.")

    return job
