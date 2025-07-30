from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.api import deps
from app.services.skill import skill

router = APIRouter()


@router.get("/", response_model=List[schemas.Skill])
def read_skills(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve skills.
    """
    skills = skill.get_multi(db, skip=skip, limit=limit)
    return skills


@router.get("/by-category", response_model=List[schemas.Skill])
def read_skills_by_category(
    db: Session = Depends(deps.get_db),
    category: str = None,
) -> Any:
    """
    Retrieve skills by category.
    """
    skills = skill.get_by_category(db, category=category)
    return skills


@router.get("/ordered", response_model=List[schemas.Skill])
def read_ordered_skills(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve skills ordered by order_index.
    """
    skills = skill.get_ordered(db)
    return skills


@router.post("/", response_model=schemas.Skill)
def create_skill(
    *,
    db: Session = Depends(deps.get_db),
    skill_in: schemas.SkillCreate,
) -> Any:
    """
    Create new skill.
    """
    skill_obj = skill.create(db=db, obj_in=skill_in)
    return skill_obj


@router.put("/{id}", response_model=schemas.Skill)
def update_skill(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    skill_in: schemas.SkillUpdate,
) -> Any:
    """
    Update a skill.
    """
    skill_obj = skill.get(db=db, id=id)
    if not skill_obj:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill_obj = skill.update(db=db, db_obj=skill_obj, obj_in=skill_in)
    return skill_obj


@router.get("/{id}", response_model=schemas.Skill)
def read_skill(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get skill by ID.
    """
    skill_obj = skill.get(db=db, id=id)
    if not skill_obj:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill_obj


@router.delete("/{id}", response_model=schemas.Skill)
def delete_skill(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a skill.
    """
    skill_obj = skill.get(db=db, id=id)
    if not skill_obj:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill_obj = skill.remove(db=db, id=id)
    return skill_obj
