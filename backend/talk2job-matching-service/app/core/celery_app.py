import os
from celery import Celery
from celery.schedules import crontab

celery_app = Celery(
    "talk2job",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0"),
)

celery_app.conf.task_reload = True
celery_app.autodiscover_tasks(
    ["app.modules.notifications", "app.modules.job.application"]
)

celery_app.conf.beat_schedule = {
    "sync-jobs-and-match-every-3-days": {
        "task": "run_full_pipeline",
        "schedule": crontab(minute=0, hour=0, day_of_month="*/3"),
    },
    "cleanup-stale-jobs-every-night": {
        "task": "app.modules.job.application.tasks.cleanup_expired_jobs",
        "schedule": crontab(hour=3, minute=0),
    },
}
celery_app.conf.timezone = "UTC"
