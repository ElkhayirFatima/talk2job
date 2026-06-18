from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.modules.notifications.application.services import NotificationService
from app.modules.job.application.fetcher.run_scraping import run as run_job_scraping
import asyncio


@celery_app.task(name="run_full_pipeline")
def run_full_pipeline_task():
    db = SessionLocal()
    try:
        print("--- [Celery] Starting Automated Pipeline ---")

        # 1. Scraping
        run_job_scraping()
        print("Scraping completed.")
        # 2. Matching
        print("🔍 Step 2: Starting Global Matching (Async)...")
        asyncio.run(NotificationService.run_global_automatic_matching(db))
        print("Matching completed.")

        return "Pipeline finished successfully"
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        db.close()
