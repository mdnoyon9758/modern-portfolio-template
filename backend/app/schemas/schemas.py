from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# Project Schemas
class ProjectBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: str
    short_description: Optional[str] = Field(None, max_length=500)
    technologies: str  # JSON string
    github_url: Optional[str] = Field(None, max_length=500)
    live_url: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)
    featured: bool = False
    order_index: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    short_description: Optional[str] = Field(None, max_length=500)
    technologies: Optional[str] = None
    github_url: Optional[str] = Field(None, max_length=500)
    live_url: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)
    featured: Optional[bool] = None
    order_index: Optional[int] = None


class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Blog Post Schemas
class BlogPostBase(BaseModel):
    title: str = Field(..., max_length=200)
    slug: str = Field(..., max_length=250)
    content: str
    excerpt: Optional[str] = Field(None, max_length=500)
    tags: Optional[str] = None  # JSON string
    featured_image: Optional[str] = Field(None, max_length=500)
    published: bool = False
    featured: bool = False
    reading_time: Optional[int] = None


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    slug: Optional[str] = Field(None, max_length=250)
    content: Optional[str] = None
    excerpt: Optional[str] = Field(None, max_length=500)
    tags: Optional[str] = None
    featured_image: Optional[str] = Field(None, max_length=500)
    published: Optional[bool] = None
    featured: Optional[bool] = None
    reading_time: Optional[int] = None


class BlogPost(BlogPostBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Contact Message Schemas
class ContactMessageBase(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    subject: Optional[str] = Field(None, max_length=200)
    message: str


class ContactMessageCreate(ContactMessageBase):
    pass


class ContactMessage(ContactMessageBase):
    id: int
    read: bool = False
    replied: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class ContactMessageUpdate(BaseModel):
    read: Optional[bool] = None
    replied: Optional[bool] = None


# Skill Schemas
class SkillBase(BaseModel):
    name: str = Field(..., max_length=100)
    category: str = Field(..., max_length=100)
    proficiency: int = Field(..., ge=1, le=100)
    icon_url: Optional[str] = Field(None, max_length=500)
    order_index: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, max_length=100)
    proficiency: Optional[int] = Field(None, ge=1, le=100)
    icon_url: Optional[str] = Field(None, max_length=500)
    order_index: Optional[int] = None


class Skill(SkillBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Experience Schemas
class ExperienceBase(BaseModel):
    company: str = Field(..., max_length=200)
    position: str = Field(..., max_length=200)
    description: Optional[str] = None
    technologies: Optional[str] = None  # JSON string
    start_date: datetime
    end_date: Optional[datetime] = None
    current: bool = False
    company_url: Optional[str] = Field(None, max_length=500)
    location: Optional[str] = Field(None, max_length=200)
    order_index: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company: Optional[str] = Field(None, max_length=200)
    position: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    technologies: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    current: Optional[bool] = None
    company_url: Optional[str] = Field(None, max_length=500)
    location: Optional[str] = Field(None, max_length=200)
    order_index: Optional[int] = None


class Experience(ExperienceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Education Schemas
class EducationBase(BaseModel):
    institution: str = Field(..., max_length=200)
    degree: str = Field(..., max_length=200)
    field_of_study: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    current: bool = False
    gpa: Optional[str] = Field(None, max_length=10)
    location: Optional[str] = Field(None, max_length=200)
    order_index: int = 0


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    institution: Optional[str] = Field(None, max_length=200)
    degree: Optional[str] = Field(None, max_length=200)
    field_of_study: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    current: Optional[bool] = None
    gpa: Optional[str] = Field(None, max_length=10)
    location: Optional[str] = Field(None, max_length=200)
    order_index: Optional[int] = None


class Education(EducationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Site Settings Schemas
class SiteSettingsBase(BaseModel):
    key: str = Field(..., max_length=100)
    value: Optional[str] = None
    description: Optional[str] = Field(None, max_length=500)


class SiteSettingsCreate(SiteSettingsBase):
    pass


class SiteSettingsUpdate(BaseModel):
    value: Optional[str] = None
    description: Optional[str] = Field(None, max_length=500)


class SiteSettings(SiteSettingsBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Response schemas
class MessageResponse(BaseModel):
    message: str


class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    size: int
    pages: int
