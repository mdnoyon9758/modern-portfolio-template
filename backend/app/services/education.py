from sqlalchemy.orm import Session
from app.models.models import Education
from app.schemas.schemas import EducationCreate, EducationUpdate
from app.services.base import CRUDBase
from typing import List


class CRUDEducation(CRUDBase[Education, EducationCreate, EducationUpdate]):
    
    def get_ordered(self, db: Session) -> List[Education]:
        """Get all education records ordered by order_index"""
        return db.query(Education).order_by(Education.order_index).all()
    
    def get_current(self, db: Session) -> List[Education]:
        """Get current education records"""
        return db.query(Education).filter(Education.current == True).order_by(Education.order_index).all()


education = CRUDEducation(Education)
