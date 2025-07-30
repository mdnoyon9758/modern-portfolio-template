from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.api import deps
from app.services.site_settings import site_settings

router = APIRouter()


@router.get("/", response_model=List[schemas.SiteSettings])
def read_site_settings(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve site settings.
    """
    settings = site_settings.get_multi(db, skip=skip, limit=limit)
    return settings


@router.post("/", response_model=schemas.SiteSettings)
def create_site_setting(
    *,
    db: Session = Depends(deps.get_db),
    setting_in: schemas.SiteSettingsCreate,
) -> Any:
    """
    Create a new site setting.
    """
    setting = site_settings.create(db=db, obj_in=setting_in)
    return setting


@router.put("/{id}", response_model=schemas.SiteSettings)
def update_site_setting(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    setting_in: schemas.SiteSettingsUpdate,
) -> Any:
    """
    Update a site setting.
    """
    setting = site_settings.get(db=db, id=id)
    if not setting:
        raise HTTPException(status_code=404, detail="Site setting not found")
    setting = site_settings.update(db=db, db_obj=setting, obj_in=setting_in)
    return setting


@router.get("/key/{key}", response_model=schemas.SiteSettings)
def read_site_setting_by_key(
    *,
    db: Session = Depends(deps.get_db),
    key: str,
) -> Any:
    """
    Get site setting by key.
    """
    setting = site_settings.get_by_key(db=db, key=key)
    if not setting:
        raise HTTPException(status_code=404, detail="Site setting not found")
    return setting


@router.get("/{id}", response_model=schemas.SiteSettings)
def read_site_setting(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get site setting by ID.
    """
    setting = site_settings.get(db=db, id=id)
    if not setting:
        raise HTTPException(status_code=404, detail="Site setting not found")
    return setting


@router.delete("/{id}", response_model=schemas.SiteSettings)
def delete_site_setting(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a site setting.
    """
    setting = site_settings.get(db=db, id=id)
    if not setting:
        raise HTTPException(status_code=404, detail="Site setting not found")
    setting = site_settings.remove(db=db, id=id)
    return setting
