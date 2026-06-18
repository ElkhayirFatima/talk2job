from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.modules.job.domain.models.job_model import Job
from datetime import datetime


class JobRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_job(self, job_data):
        """
        Insert job into DB
        """
        job = Job(**job_data)
        self.db.add(job)
        self.db.commit()
        return job

    def get_jobs(
        self,
        title: str = None,
        city: str = None,
        country: str = None,
        seniority: str = None,
        is_remote: bool = None,
        company: str = None,
    ):
        """
        Advanced filtering for jobs based on multiple criteria.
        """
        query = self.db.query(Job)

        if title:
            query = query.filter(Job.title.ilike(f"%{title}%"))

        if company:
            query = query.filter(Job.company.ilike(f"%{company}%"))

        if city or country:
            location_filters = []
            if city:
                location_filters.append(Job.location.ilike(f"%{city}%"))
            if country:
                if country in ["MA", "Morocco"]:
                    location_filters.append(Job.location.ilike("%MA%"))
                    location_filters.append(Job.location.ilike("%Morocco%"))
                    location_filters.append(Job.location.ilike("%Maroc%"))
                else:
                    location_filters.append(Job.location.ilike(f"%{country}%"))
            query = query.filter(or_(*location_filters))

        if seniority:

            val = seniority.value if hasattr(seniority, "value") else seniority
            query = query.filter(Job.seniority_level.ilike(f"%{val}%"))

        if is_remote is not None:
            if is_remote:
                query = query.filter(
                    or_(
                        Job.is_remote == True,
                        Job.location.ilike("%remote%"),
                        Job.description.ilike("%remote%"),
                    )
                )
        return query.order_by(Job.id.desc()).all()

    def get_job_by_id(self, id: int):
        return self.db.query(Job).filter(Job.id == id).first()

    def get_job_by_external_id(self, job_id: str):
        return self.db.query(Job).filter(Job.job_id == job_id).first()

    def get_unique_companies(self):

        companies = self.db.query(Job.company).distinct().all()
        return [c[0] for c in companies if c[0]]

    def get_all_active_jobs(self):
        """
        Fetch all jobs that are currently marked as active.
        Used by the cleanup task to verify URL availability.
        """
        return self.db.query(Job).filter(Job.is_active == True).all()

    def update_job_status(self, job_id: int, is_active: bool):
        """
        Update the active status of a specific job and refresh the check timestamp.
        """
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.is_active = is_active
            job.last_checked_at = datetime.utcnow()
            self.db.commit()
        return job
