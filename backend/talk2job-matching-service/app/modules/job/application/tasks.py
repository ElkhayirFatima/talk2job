from celery import shared_task
from datetime import datetime
from app.core.database import SessionLocal
from app.modules.job.infrastructure.repository.job_repository import JobRepository
from app.modules.job.infrastructure.external.url_validator import check_url_status
from app.core.vector_service import VectorService
import logging

# Configure logging for better observability
logger = logging.getLogger(__name__)


@shared_task(name="app.modules.job.application.tasks.cleanup_expired_jobs")
def cleanup_expired_jobs():
    """
    Background periodic task to scan all active job listings, verify their URL availability,
    and perform soft-deletions on expired or broken links across both PostgreSQL and the Vector DB.
    """
    db = SessionLocal()
    repository = JobRepository(db)

    try:
        # 1. Fetch all listings currently marked as active
        active_jobs = repository.get_all_active_jobs()
        logger.info(f"Checking {len(active_jobs)} active jobs for expiration...")

        for job in active_jobs:
            # 2. Check external URL status (uses HEAD with GET fallback)
            is_valid = check_url_status(job.job_url)

            if not is_valid:
                logger.warning(f"Job {job.id} has expired (404/410). Deactivating...")

                # 1. Soft delete: Mark the job as inactive
                job.is_active = False
                job.last_checked_at = datetime.utcnow()

                # 2. Clear vectors within the same row to exclude it from future semantic searches 🎯
                job.core_skills_vector = None
                job.secondary_skills_vector = None
                job.summary_vector = None

        # 5. Commit all staged updates in a single transaction for optimal performance and atomicity 🚀
        db.commit()
        logger.info("Cleanup task completed successfully.")

    except Exception as e:
        # Rollback SQL transaction if any database operation or Vector Service call fails
        logger.error(f"Critical error during cleanup task: {str(e)}")
        db.rollback()
        raise e
    finally:
        # Always close the database session to prevent connection pools from leaking
        db.close()
