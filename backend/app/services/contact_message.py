from app.models.models import ContactMessage
from app.schemas.schemas import ContactMessageCreate, ContactMessageUpdate
from sqlalchemy.orm import Session
from app.services.base import CRUDBase


class CRUDContactMessage(CRUDBase[ContactMessage, ContactMessageCreate, ContactMessageUpdate]):
    def mark_as_read(self, db: Session, *, db_obj: ContactMessage) -> ContactMessage:
        db_obj.read = True
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def mark_as_replied(self, db: Session, *, db_obj: ContactMessage) -> ContactMessage:
        db_obj.replied = True
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_unread(self, db: Session):
        """Get all unread contact messages"""
        return db.query(ContactMessage).filter(ContactMessage.read == False).order_by(ContactMessage.created_at.desc()).all()
    
    def get_unreplied(self, db: Session):
        """Get all unreplied contact messages"""
        return db.query(ContactMessage).filter(ContactMessage.replied == False).order_by(ContactMessage.created_at.desc()).all()


contact_message = CRUDContactMessage(ContactMessage)
