from fastapi import APIRouter
from app.api.v1.endpoints import projects, blog, contact, portfolio, site_settings, skills, experience, education

api_router = APIRouter()
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
api_router.include_router(site_settings.router, prefix="/site-settings", tags=["site-settings"])
api_router.include_router(skills.router, prefix="/skills", tags=["skills"])
api_router.include_router(experience.router, prefix="/experience", tags=["experience"])
api_router.include_router(education.router, prefix="/education", tags=["education"])
