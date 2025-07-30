from sqlalchemy.orm import Session
from app.models.models import Experience
from app.schemas.schemas import ExperienceCreate, ExperienceUpdate
from app.services.base import CRUDBase
from typing import List


class CRUDExperience(CRUDBase[Experience, ExperienceCreate, ExperienceUpdate]):
    
    def get_ordered(self, db: Session) -> List[Experience]:
        """Get all experiences ordered by order_index"""
        return db.query(Experience).order_by(Experience.order_index).all()
    
    def get_current(self, db: Session) -> List[Experience]:
        """Get current experiences"""
        return db.query(Experience).filter(Experience.current == True).order_by(Experience.order_index).all()


experience = CRUDExperience(Experience)
