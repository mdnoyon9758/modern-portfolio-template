from typing import List
from sqlalchemy.orm import Session
from app.models.models import Skill, Experience, Education, SiteSettings
from app.schemas.schemas import (
    SkillCreate, SkillUpdate,
    ExperienceCreate, ExperienceUpdate, 
    EducationCreate, EducationUpdate,
    SiteSettingsCreate, SiteSettingsUpdate
)
from app.services.base import CRUDBase


class CRUDSkill(CRUDBase[Skill, SkillCreate, SkillUpdate]):
    def get_by_category(self, db: Session, category: str) -> List[Skill]:
        """Get skills by category ordered by proficiency"""
        return (
            db.query(Skill)
            .filter(Skill.category == category)
            .order_by(Skill.order_index, Skill.proficiency.desc())
            .all()
        )
    
    def get_ordered(self, db: Session) -> List[Skill]:
        """Get all skills ordered by order_index and proficiency"""
        return (
            db.query(Skill)
            .order_by(Skill.order_index, Skill.proficiency.desc())
            .all()
        )


class CRUDExperience(CRUDBase[Experience, ExperienceCreate, ExperienceUpdate]):
    def get_ordered(self, db: Session) -> List[Experience]:
        """Get experiences ordered by start_date (most recent first)"""
        return (
            db.query(Experience)
            .order_by(Experience.order_index, Experience.start_date.desc())
            .all()
        )
    
    def get_current(self, db: Session) -> List[Experience]:
        """Get current experiences"""
        return (
            db.query(Experience)
            .filter(Experience.current == True)
            .order_by(Experience.start_date.desc())
            .all()
        )


class CRUDEducation(CRUDBase[Education, EducationCreate, EducationUpdate]):
    def get_ordered(self, db: Session) -> List[Education]:
        """Get education ordered by start_date (most recent first)"""
        return (
            db.query(Education)
            .order_by(Education.order_index, Education.start_date.desc())
            .all()
        )


class CRUDSiteSettings(CRUDBase[SiteSettings, SiteSettingsCreate, SiteSettingsUpdate]):
    def get_by_key(self, db: Session, key: str) -> SiteSettings:
        """Get site setting by key"""
        return db.query(SiteSettings).filter(SiteSettings.key == key).first()
    
    def update_by_key(self, db: Session, key: str, value: str) -> SiteSettings:
        """Update or create site setting by key"""
        db_obj = self.get_by_key(db, key)
        if db_obj:
            db_obj.value = value
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        else:
            # Create new setting
            new_setting = SiteSettings(key=key, value=value)
            db.add(new_setting)
            db.commit()
            db.refresh(new_setting)
            return new_setting


# Create instances
skill = CRUDSkill(Skill)
experience = CRUDExperience(Experience)
education = CRUDEducation(Education)
site_settings = CRUDSiteSettings(SiteSettings)
