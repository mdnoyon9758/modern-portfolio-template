import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from app.models.models import BlogPost
from app.schemas.schemas import BlogPostCreate, BlogPostUpdate
from app.services.base import CRUDBase
from app.core.security import security_manager

# Set up logger for blog post service
logger = logging.getLogger("services.blog_post")


class CRUDBlogPost(CRUDBase[BlogPost, BlogPostCreate, BlogPostUpdate]):
    """Enhanced Blog Post CRUD service with comprehensive logging and security."""
    
    def get_featured(self, db: Session, limit: int = 3) -> List[BlogPost]:
        """
        Retrieve the 3 most recent published blog posts for featuring.
        This ensures we always show the latest content regardless of featured flag.
        
        Args:
            db: Database session
            limit: Maximum number of posts to return (default 3)
            
        Returns:
            List of most recent published blog posts
            
        Raises:
            HTTPException: If database operation fails
        """
        try:
            logger.info(f"Fetching most recent blog posts for featuring (limit: {limit})")
            
            # Get the most recent published posts, ordered by published_at descending
            posts = (
                db.query(BlogPost)
                .filter(BlogPost.published == True)
                .order_by(BlogPost.published_at.desc(), BlogPost.created_at.desc())
                .limit(limit)
                .all()
            )
            
            logger.info(f"Successfully retrieved {len(posts)} recent blog posts for featuring")
            return posts
            
        except SQLAlchemyError as e:
            logger.error(f"Database error while fetching featured posts: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve featured blog posts"
            )
        except Exception as e:
            logger.error(f"Unexpected error in get_featured: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )
    
    def get_published(self, db: Session, skip: int = 0, limit: int = 100) -> List[BlogPost]:
        """
        Retrieve published blog posts with pagination.
        
        Args:
            db: Database session
            skip: Number of posts to skip for pagination
            limit: Maximum number of posts to return
            
        Returns:
            List of published blog posts
        """
        try:
            logger.info(f"Fetching published blog posts (skip: {skip}, limit: {limit})")
            
            posts = (
                db.query(BlogPost)
                .filter(BlogPost.published == True)
                .order_by(BlogPost.published_at.desc())
                .offset(skip)
                .limit(limit)
                .all()
            )
            
            logger.info(f"Successfully retrieved {len(posts)} published blog posts")
            return posts
            
        except SQLAlchemyError as e:
            logger.error(f"Database error while fetching published posts: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve published blog posts"
            )
    
    def get_by_slug(self, db: Session, slug: str) -> Optional[BlogPost]:
        """
        Retrieve a blog post by its slug.
        
        Args:
            db: Database session
            slug: Blog post slug
            
        Returns:
            Blog post if found, None otherwise
        """
        try:
            # Sanitize slug input
            clean_slug = security_manager.sanitize_input(slug)
            logger.info(f"Fetching blog post by slug: {clean_slug}")
            
            post = (
                db.query(BlogPost)
                .filter(BlogPost.slug == clean_slug, BlogPost.published == True)
                .first()
            )
            
            if post:
                logger.info(f"Successfully retrieved blog post: {post.title}")
            else:
                logger.warning(f"Blog post not found for slug: {clean_slug}")
                
            return post
            
        except SQLAlchemyError as e:
            logger.error(f"Database error while fetching post by slug {slug}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve blog post"
            )
    
    def create_with_validation(self, db: Session, *, obj_in: BlogPostCreate, author_id: int) -> BlogPost:
        """
        Create a new blog post with comprehensive validation and logging.
        
        Args:
            db: Database session
            obj_in: Blog post creation data
            author_id: ID of the author creating the post
            
        Returns:
            Created blog post
        """
        try:
            logger.info(f"Creating new blog post: {obj_in.title} by author {author_id}")
            
            # Sanitize input data
            sanitized_data = {
                "title": security_manager.sanitize_input(obj_in.title),
                "content": security_manager.sanitize_input(obj_in.content),
                "excerpt": security_manager.sanitize_input(obj_in.excerpt or ""),
                "slug": self._generate_slug(obj_in.title),
                "author_id": author_id,
                "published": obj_in.published or False,
                "featured": obj_in.featured or False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "published_at": datetime.utcnow() if obj_in.published else None
            }
            
            # Check for duplicate slug
            existing_post = db.query(BlogPost).filter(BlogPost.slug == sanitized_data["slug"]).first()
            if existing_post:
                logger.warning(f"Duplicate slug detected: {sanitized_data['slug']}")
                sanitized_data["slug"] = f"{sanitized_data['slug']}-{int(datetime.utcnow().timestamp())}"
            
            # Create the blog post
            db_obj = BlogPost(**sanitized_data)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            
            logger.info(f"Successfully created blog post with ID: {db_obj.id}")
            return db_obj
            
        except SQLAlchemyError as e:
            logger.error(f"Database error while creating blog post: {str(e)}")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create blog post"
            )
        except Exception as e:
            logger.error(f"Unexpected error in create_with_validation: {str(e)}")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while creating the blog post"
            )
    
    def get_analytics(self, db: Session) -> Dict[str, Any]:
        """
        Get blog analytics including post counts and engagement metrics.
        
        Args:
            db: Database session
            
        Returns:
            Dictionary containing analytics data
        """
        try:
            logger.info("Generating blog analytics")
            
            total_posts = db.query(BlogPost).count()
            published_posts = db.query(BlogPost).filter(BlogPost.published == True).count()
            featured_posts = db.query(BlogPost).filter(BlogPost.featured == True).count()
            draft_posts = total_posts - published_posts
            
            analytics = {
                "total_posts": total_posts,
                "published_posts": published_posts,
                "draft_posts": draft_posts,
                "featured_posts": featured_posts,
                "publication_rate": round((published_posts / total_posts * 100), 2) if total_posts > 0 else 0
            }
            
            logger.info(f"Analytics generated: {analytics}")
            return analytics
            
        except SQLAlchemyError as e:
            logger.error(f"Database error while generating analytics: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate blog analytics"
            )
    
    def _generate_slug(self, title: str) -> str:
        """
        Generate a URL-friendly slug from the blog post title.
        
        Args:
            title: Blog post title
            
        Returns:
            URL-friendly slug
        """
        import re
        # Convert to lowercase and replace spaces with hyphens
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')


blog_post = CRUDBlogPost(BlogPost)
