from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.modules.notifications.infrastructure.repositories.notif_repository import (
    NotificationRepository,
)
from app.modules.notifications.domain.schemas.notif_schema import (
    NotificationResponse,
    UnreadCount,
)

router = APIRouter()


@router.get("", response_model=List[NotificationResponse])
def fetch_notifications(user_id: str, db: Session = Depends(get_db)):
    """Retrieve the full list of job matches for the user"""
    return NotificationRepository.get_all_for_user(db, user_id)


@router.get("/unread-count", response_model=UnreadCount)
def get_unread_total(user_id: str, db: Session = Depends(get_db)):
    """Get the badge number for unread notifications"""
    count = NotificationRepository.count_unread(db, user_id)
    return {"unread_count": count}


@router.patch("/{notif_id}/read", response_model=NotificationResponse)
def mark_read(notif_id: int, db: Session = Depends(get_db)):
    """Update notification status when clicked by user"""
    notif = NotificationRepository.mark_as_read(db, notif_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif


@router.delete("/{notif_id}")
def remove_notification(notif_id: int, db: Session = Depends(get_db)):
    """Permanently delete a specific notification"""
    if not NotificationRepository.delete(db, notif_id):
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Deleted successfully"}
