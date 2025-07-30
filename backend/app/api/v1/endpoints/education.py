from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.api import deps
from app.services.education import education

router = APIRouter()


@router.get("/", response_model=List[schemas.Education])
def read_education(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve education records.
    """
    education_records = education.get_multi(db, skip=skip, limit=limit)
    return education_records


@router.get("/ordered", response_model=List[schemas.Education])
def read_ordered_education(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve education records ordered by order_index.
    """
    education_records = education.get_ordered(db)
    return education_records


@router.get("/current", response_model=List[schemas.Education])
def read_current_education(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve current education records.
    """
    education_records = education.get_current(db)
    return education_records


@router.post("/", response_model=schemas.Education)
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


@router.put("/{id}", response_model=schemas.Education)
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


@router.get("/{id}", response_model=schemas.Education)
def read_education_by_id(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get education record by ID.
    """
    education_obj = education.get(db=db, id=id)
    if not education_obj:
        raise HTTPException(status_code=404, detail="Education record not found")
    return education_obj


@router.delete("/{id}", response_model=schemas.Education)
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
