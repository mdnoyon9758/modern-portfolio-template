from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    short_description = Column(String(500), nullable=True)
    technologies = Column(Text, nullable=False)  # JSON string of technologies
    github_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    featured = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=False)
    excerpt = Column(String(500), nullable=True)
    tags = Column(Text, nullable=True)  # JSON string of tags
    featured_image = Column(String(500), nullable=True)
    published = Column(Boolean, default=False)
    featured = Column(Boolean, default=False)
    reading_time = Column(Integer, nullable=True)  # in minutes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)


class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    subject = Column(String(200), nullable=True)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    replied = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)  # Frontend, Backend, Database, etc.
    proficiency = Column(Integer, nullable=False)  # 1-100
    icon_url = Column(String(500), nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Experience(Base):
    __tablename__ = "experiences"
    
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(200), nullable=False)
    position = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    technologies = Column(Text, nullable=True)  # JSON string
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)  # NULL for current job
    current = Column(Boolean, default=False)
    company_url = Column(String(500), nullable=True)
    location = Column(String(200), nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    institution = Column(String(200), nullable=False)
    degree = Column(String(200), nullable=False)
    field_of_study = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    current = Column(Boolean, default=False)
    gpa = Column(String(10), nullable=True)
    location = Column(String(200), nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SiteSettings(Base):
    __tablename__ = "site_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text, nullable=True)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
