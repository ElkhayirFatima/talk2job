import sys
from app.core.database import SessionLocal
from app.modules.job.application.fetcher.job_fetcher import fetch_all_jobs
from app.modules.job.application.use_cases.job_use_case import save_jobs


def run():
    """
    Orchestrates the scraping and saving process with basic safety checks.
    """
    db = SessionLocal()

    try:
        print("🔍 Step 1: Fetching jobs from APIs...")
        jobs = fetch_all_jobs()

        # Check if we actually got any results before proceeding
        if not jobs:
            print("No jobs found during fetching. Exiting...")
            return

        print(
            f"Step 2: Processing and saving {len(jobs)} jobs (Limit applied in use_case)..."
        )

        # This calls your save_jobs which now handles the [:20] limit and time.sleep
        inserted_count = save_jobs(db, jobs)

        print(f"Success! {inserted_count} new jobs were processed and saved to the DB.")

    except Exception as e:
        print(f"❌ CRITICAL ERROR during scraping orchestration: {e}")
        # Optional: Log the full traceback for debugging
        # import traceback; traceback.print_exc()

    finally:
        # Always close the DB connection to prevent memory leaks
        db.close()
        print("Database connection closed.")


if __name__ == "__main__":
    run()
