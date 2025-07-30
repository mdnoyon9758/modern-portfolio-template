from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.api import deps
from app.services.blog_post import blog_post

router = APIRouter()


@router.get("/", response_model=List[schemas.BlogPost])
def read_blog_posts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve blog posts.
    """
    posts = blog_post.get_multi(db, skip=skip, limit=limit)
    return posts


@router.get("/published", response_model=List[schemas.BlogPost])
def read_published_blog_posts(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve published blog posts.
    """
    posts = blog_post.get_published(db)
    return posts


@router.get("/featured", response_model=List[schemas.BlogPost])
def read_featured_blog_posts(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve featured blog posts (limited to 3 most recent).
    """
    posts = blog_post.get_featured(db, limit=3)
    return posts


@router.post("/", response_model=schemas.BlogPost)
def create_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    post_in: schemas.BlogPostCreate,
) -> Any:
    """
    Create new blog post.
    """
    post = blog_post.create(db=db, obj_in=post_in)
    return post


@router.put("/{id}", response_model=schemas.BlogPost)
def update_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    post_in: schemas.BlogPostUpdate,
) -> Any:
    """
    Update a blog post.
    """
    post = blog_post.get(db=db, id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    post = blog_post.update(db=db, db_obj=post, obj_in=post_in)
    return post


@router.get("/{id}", response_model=schemas.BlogPost)
def read_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get blog post by ID.
    """
    post = blog_post.get(db=db, id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.get("/slug/{slug}", response_model=schemas.BlogPost)
def read_blog_post_by_slug(
    *,
    db: Session = Depends(deps.get_db),
    slug: str,
) -> Any:
    """
    Get blog post by slug.
    """
    post = blog_post.get_by_slug(db=db, slug=slug)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.delete("/{id}", response_model=schemas.BlogPost)
def delete_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a blog post.
    """
    post = blog_post.get(db=db, id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    post = blog_post.remove(db=db, id=id)
    return post
