from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.api import deps
from app.services.portfolio import skill, experience, education

router = APIRouter()

# Skills endpoints
@router.get("/skills", response_model=List[schemas.Skill])
def read_skills(
    db: Session = Depends(deps.get_db),
    category: str = None,
) -> Any:
    """
    Retrieve skills, optionally filtered by category.
    """
    if category:
        skills = skill.get_by_category(db, category=category)
    else:
        skills = skill.get_ordered(db)
    return skills


@router.post("/skills", response_model=schemas.Skill)
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


@router.put("/skills/{id}", response_model=schemas.Skill)
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


@router.delete("/skills/{id}", response_model=schemas.Skill)
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


# Experience endpoints
@router.get("/experience", response_model=List[schemas.Experience])
def read_experiences(
    db: Session = Depends(deps.get_db),
    current_only: bool = False,
) -> Any:
    """
    Retrieve experiences.
    """
    if current_only:
        experiences = experience.get_current(db)
    else:
        experiences = experience.get_ordered(db)
    return experiences


@router.post("/experience", response_model=schemas.Experience)
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


@router.put("/experience/{id}", response_model=schemas.Experience)
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


@router.delete("/experience/{id}", response_model=schemas.Experience)
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


# Education endpoints
@router.get("/education", response_model=List[schemas.Education])
def read_education(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve education records.
    """
    education_records = education.get_ordered(db)
    return education_records


@router.post("/education", response_model=schemas.Education)
def create_education(
    *,
    db: Session = Depends(deps.get_db),
    education_in: schemas.EducationCreate,
) -> Any:
    """
    Create new education record.
    """
    education_obj = education.create(db=db, obj_in=education_in)
    return education_obj


@router.put("/education/{id}", response_model=schemas.Education)
def update_education(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    education_in: schemas.EducationUpdate,
) -> Any:
    """
    Update an education record.
    """
    education_obj = education.get(db=db, id=id)
    if not education_obj:
        raise HTTPException(status_code=404, detail="Education record not found")
    education_obj = education.update(db=db, db_obj=education_obj, obj_in=education_in)
    return education_obj


@router.delete("/education/{id}", response_model=schemas.Education)
def delete_education(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete an education record.
    """
    education_obj = education.get(db=db, id=id)
    if not education_obj:
        raise HTTPException(status_code=404, detail="Education record not found")
    education_obj = education.remove(db=db, id=id)
    return education_obj
