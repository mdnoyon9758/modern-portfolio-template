from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.api import deps
from app.services.project import project

router = APIRouter()


@router.get("/", response_model=List[schemas.Project])
def read_projects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve projects.
    """
    projects = project.get_multi(db, skip=skip, limit=limit)
    return projects


@router.get("/featured", response_model=List[schemas.Project])
def read_featured_projects(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve featured projects.
    """
    projects = project.get_featured(db)
    return projects


@router.get("/ordered", response_model=List[schemas.Project])
def read_ordered_projects(
    db: Session = Depends(deps.get_db),
    limit: int = None,
) -> Any:
    """
    Retrieve projects ordered by order_index.
    """
    projects = project.get_ordered(db, limit=limit)
    return projects


@router.post("/", response_model=schemas.Project)
def create_project(
    *,
    db: Session = Depends(deps.get_db),
    project_in: schemas.ProjectCreate,
) -> Any:
    """
    Create new project.
    """
    project_obj = project.create(db=db, obj_in=project_in)
    return project_obj


@router.put("/{id}", response_model=schemas.Project)
def update_project(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    project_in: schemas.ProjectUpdate,
) -> Any:
    """
    Update a project.
    """
    project_obj = project.get(db=db, id=id)
    if not project_obj:
        raise HTTPException(status_code=404, detail="Project not found")
    project_obj = project.update(db=db, db_obj=project_obj, obj_in=project_in)
    return project_obj


@router.get("/{id}", response_model=schemas.Project)
def read_project(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get project by ID.
    """
    project_obj = project.get(db=db, id=id)
    if not project_obj:
        raise HTTPException(status_code=404, detail="Project not found")
    return project_obj


@router.delete("/{id}", response_model=schemas.Project)
def delete_project(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a project.
    """
    project_obj = project.get(db=db, id=id)
    if not project_obj:
        raise HTTPException(status_code=404, detail="Project not found")
    project_obj = project.remove(db=db, id=id)
    return project_obj
