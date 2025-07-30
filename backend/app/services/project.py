from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Project
from app.schemas.schemas import ProjectCreate, ProjectUpdate
from app.services.base import CRUDBase


class CRUDProject(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    def get_featured(self, db: Session) -> List[Project]:
        """Get all featured projects ordered by order_index"""
        return (
            db.query(Project)
            .filter(Project.featured == True)
            .order_by(Project.order_index, Project.created_at.desc())
            .all()
        )
    
    def get_by_technology(self, db: Session, technology: str) -> List[Project]:
        """Get projects that use a specific technology"""
        return (
            db.query(Project)
            .filter(Project.technologies.contains(technology))
            .order_by(Project.order_index, Project.created_at.desc())
            .all()
        )
    
    def get_ordered(self, db: Session, limit: Optional[int] = None) -> List[Project]:
        """Get projects ordered by order_index and creation date"""
        query = db.query(Project).order_by(Project.order_index, Project.created_at.desc())
        if limit:
            query = query.limit(limit)
        return query.all()


project = CRUDProject(Project)
