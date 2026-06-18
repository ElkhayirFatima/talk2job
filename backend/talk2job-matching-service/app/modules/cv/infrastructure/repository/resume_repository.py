from sqlalchemy.orm import Session
from app.modules.cv.domain.models.resume_model import Resume


class ResumeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, resume: Resume):
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def get_by_hash(self, user_id: int, file_hash: str):
        """Used to check if a specific file was already uploaded by this user."""
        return (
            self.db.query(Resume)
            .filter(Resume.user_id == user_id, Resume.file_hash == file_hash)
            .first()
        )

    def deactivate_all_user_resumes(self, user_id: int):
        """Mass update to set all user resumes as inactive."""
        self.db.query(Resume).filter(Resume.user_id == user_id).update(
            {"is_active": False}
        )
        self.db.commit()

    def get_by_id(self, resume_id: int):
        """Find one specific resume."""
        return self.db.query(Resume).filter(Resume.id == resume_id).first()

    def get_all_by_user_id(self, user_id: int):
        """Get the full history of resumes for a user."""
        return self.db.query(Resume).filter(Resume.user_id == user_id).all()

    def delete(self, resume: Resume):
        """Remove a record from DB."""
        self.db.delete(resume)
        self.db.commit()
