from sqlalchemy.orm import Session, joinedload
from app.modules.notifications.domain.models.notif_model import JobNotification


class NotificationRepository:
    """
    Handles Database operations for Notifications.
    Separates SQL logic from the API routes.
    """

    @staticmethod
    def get_all_for_user(db: Session, user_id: str):
        """Fetch all notifications for a specific user with Job details"""
        return (
            db.query(JobNotification)
            .options(joinedload(JobNotification.job))
            .filter(JobNotification.user_id == user_id)
            .order_by(JobNotification.created_at.desc())
            .all()
        )

    @staticmethod
    def mark_as_read(db: Session, notif_id: int):
        """Update a single notification status to 'read'"""
        notif = db.query(JobNotification).filter(JobNotification.id == notif_id).first()
        if notif:
            notif.is_read = True
            db.commit()
            db.refresh(notif)
        return notif

    @staticmethod
    def count_unread(db: Session, user_id: str):
        """Return the total number of unread notifications for a user"""
        return (
            db.query(JobNotification)
            .filter(
                JobNotification.user_id == user_id, JobNotification.is_read == False
            )
            .count()
        )

    @staticmethod
    def delete(db: Session, notif_id: int):
        """Delete a notification from the database"""
        notif = db.query(JobNotification).filter(JobNotification.id == notif_id).first()
        if notif:
            db.delete(notif)
            db.commit()
            return True
        return False
