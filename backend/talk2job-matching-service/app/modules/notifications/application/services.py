from sqlalchemy.orm import Session
from app.modules.cv.domain.models.resume_model import Resume
from app.modules.cv.infrastructure.repository.resume_repository import ResumeRepository
from app.modules.matching.application.ranker.job_ranker import JobRanker
from app.modules.notifications.domain.models.notif_model import JobNotification


class NotificationService:
    @staticmethod
    async def run_automatic_matching_for_user(user_id: str, db: Session):
        """
        Orchestrates the background matching process for a specific user.
        Leverages the JobRanker (pgvector + FlashRank) to identify and persist high-quality matches.
        """

        # We look for the active CV to ensure matching is based on the latest profile
        cv = db.query(Resume).filter_by(user_id=user_id, is_active=True).first()
        if not cv:
            return {"status": "skipped", "reason": "No active CV found for this user"}

        # 2. Initialize JobRanker to execute the two-stage ranking pipeline
        ranker = JobRanker()

        # We set a threshold (e.g., 70.0) to notify users only about highly relevant opportunities
        top_matches = ranker.get_ranked_jobs(db=db, cv=cv, score_threshold=70.0)

        new_notifications_count = 0

        for match in top_matches:
            # 3. Duplicate Prevention: Check if this job has already been recommended to the user
            # This avoids spamming the user with the same job multiple times
            already_notified = (
                db.query(JobNotification)
                .filter_by(user_id=user_id, job_id=match["job_id"])
                .first()
            )

            if not already_notified:
                # 4. Create and persist the new job notification
                new_notif = JobNotification(
                    user_id=user_id,
                    job_id=match["job_id"],
                    match_score=match["ranking_score"],
                    insight_message=match["insight_message"],
                    is_read=False,
                )
                db.add(new_notif)
                new_notifications_count += 1

        # Commit all changes to the database
        db.commit()

        return {
            "status": "success",
            "user_id": user_id,
            "total_matches_identified": len(top_matches),
            "new_notifications_created": new_notifications_count,
        }

    @staticmethod
    async def run_global_automatic_matching(db: Session):
        """
        Iterates through all active resumes and runs the matching ranker.
        """
        active_resumes = db.query(Resume).filter(Resume.is_active == True).all()

        summary_results = []
        for resume in active_resumes:
            res = await NotificationService.run_automatic_matching_for_user(
                resume.user_id, db
            )
            summary_results.append(res)

        return summary_results
