import os
from app.modules.cv.infrastructure.repository.resume_repository import ResumeRepository


class ResumeService:
    def __init__(self, db):
        self.db = db
        self.repo = ResumeRepository(db)

    def get_resume(self, resume_id: int):
        """Get single resume details."""
        return self.repo.get_by_id(resume_id)

    def list_user_resumes(self, user_id: str):
        """Get all resumes for the user dashboard."""
        return self.repo.get_all_by_user_id(user_id)

    def activate_resume(self, user_id: str, resume_id: int):
        """
        The 'Switch' Logic:
        1. Turn OFF everything for this user (using repo.deactivate_all_user_resumes)
        2. Turn ON the specific one (using repo.get_by_id)
        """
        # Step 1: Deactivate all first
        self.repo.deactivate_all_user_resumes(user_id)

        # Step 2: Activate the chosen one
        resume = self.repo.get_by_id(resume_id)
        if not resume or resume.user_id != user_id:
            return None  # Or raise an error

        resume.is_active = True
        self.db.commit()  # Save the change
        return resume

    def delete_resume(self, resume_id: int, user_id: str):
        """Cleanup logic: Remove from disk AND database."""
        resume = self.repo.get_by_id(resume_id)

        if not resume or resume.user_id != user_id:
            return False

        # Physical cleanup
        if resume.file_path and os.path.exists(resume.file_path):
            os.remove(resume.file_path)

        # DB cleanup
        self.repo.delete(resume)
        return True
