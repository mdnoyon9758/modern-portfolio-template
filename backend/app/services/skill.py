from sqlalchemy.orm import Session
from app.models.models import Skill
from app.schemas.schemas import SkillCreate, SkillUpdate
from app.services.base import CRUDBase
from typing import List, Optional


class CRUDSkill(CRUDBase[Skill, SkillCreate, SkillUpdate]):
    
    def get_by_category(self, db: Session, *, category: str = None) -> List[Skill]:
        """Get skills by category"""
        query = db.query(Skill)
        if category:
            query = query.filter(Skill.category == category)
        return query.order_by(Skill.order_index).all()
    
    def get_ordered(self, db: Session) -> List[Skill]:
        """Get all skills ordered by order_index"""
        return db.query(Skill).order_by(Skill.order_index).all()


skill = CRUDSkill(Skill)
