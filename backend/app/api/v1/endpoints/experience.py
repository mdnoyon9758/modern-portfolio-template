from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.api import deps
from app.services.experience import experience

router = APIRouter()


@router.get("/", response_model=List[schemas.Experience])
def read_experiences(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve experiences.
    """
    experiences = experience.get_multi(db, skip=skip, limit=limit)
    return experiences


@router.get("/ordered", response_model=List[schemas.Experience])
def read_ordered_experiences(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve experiences ordered by order_index.
    """
    experiences = experience.get_ordered(db)
    return experiences


@router.get("/current", response_model=List[schemas.Experience])
def read_current_experiences(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve current experiences.
    """
    experiences = experience.get_current(db)
    return experiences


@router.post("/", response_model=schemas.Experience)
def create_experience(
    *,
    db: Session = Depends(deps.get_db),
    experience_in: schemas.ExperienceCreate,
) -> Any:
    """
    Create new experience.
    """
    experience_obj = experience.create(db=db, obj_in=experience_in)
    return experience_obj


@router.put("/{id}", response_model=schemas.Experience)
def update_experience(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    experience_in: schemas.ExperienceUpdate,
) -> Any:
    """
    Update an experience.
    """
    experience_obj = experience.get(db=db, id=id)
    if not experience_obj:
        raise HTTPException(status_code=404, detail="Experience not found")
    experience_obj = experience.update(db=db, db_obj=experience_obj, obj_in=experience_in)
    return experience_obj


@router.get("/{id}", response_model=schemas.Experience)
def read_experience(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get experience by ID.
    """
    experience_obj = experience.get(db=db, id=id)
    if not experience_obj:
        raise HTTPException(status_code=404, detail="Experience not found")
    return experience_obj


@router.delete("/{id}", response_model=schemas.Experience)
def delete_experience(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete an experience.
    """
    experience_obj = experience.get(db=db, id=id)
    if not experience_obj:
        raise HTTPException(status_code=404, detail="Experience not found")
    experience_obj = experience.remove(db=db, id=id)
    return experience_obj
