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
    
    def bulk_update(self, db: Session, *, settings_data: list) -> list:
        """
        Bulk update or create site settings.
        """
        updated_settings = []
        
        for setting_data in settings_data:
            key = setting_data['key']
            value = setting_data['value']
            description = setting_data.get('description')
            
            # Try to find existing setting by key
            existing_setting = self.get_by_key(db=db, key=key)
            
            if existing_setting:
                # Update existing setting
                update_data = {'value': value}
                if description is not None:
                    update_data['description'] = description
                
                updated_setting = self.update(
                    db=db, 
                    db_obj=existing_setting, 
                    obj_in=update_data
                )
                updated_settings.append(updated_setting)
            else:
                # Create new setting
                create_data = schemas.SiteSettingsCreate(
                    key=key,
                    value=value,
                    description=description
                )
                new_setting = self.create(db=db, obj_in=create_data)
                updated_settings.append(new_setting)
        
        return updated_settings

site_settings = CRUDSiteSettings()
