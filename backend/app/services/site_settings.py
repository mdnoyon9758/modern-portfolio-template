from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from typing import Any, Dict, Optional, Union

class CRUDSiteSettings:

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100):
        return db.query(models.SiteSettings).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: schemas.SiteSettingsCreate):
        db_obj = models.SiteSettings(key=obj_in.key, value=obj_in.value, description=obj_in.description)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get(self, db: Session, *, id: int):
        return db.query(models.SiteSettings).filter(models.SiteSettings.id == id).first()
    
    def get_by_key(self, db: Session, *, key: str):
        return db.query(models.SiteSettings).filter(models.SiteSettings.key == key).first()

    def update(
        self,
        db: Session,
        *,
        db_obj: models.SiteSettings,
        obj_in: Union[schemas.SiteSettingsUpdate, Dict[str, Any]],
    ) -> models.SiteSettings:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> models.SiteSettings:
        obj = db.query(models.SiteSettings).get(id)
        db.delete(obj)
        db.commit()
        return obj

site_settings = CRUDSiteSettings()
