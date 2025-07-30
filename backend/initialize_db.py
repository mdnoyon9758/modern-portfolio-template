#!/usr/bin/env python3
"""
Database initialization script for portfolio website.
Creates all tables and optionally seeds with sample data.
"""

from app.db.database import engine, Base
from app.models import models
from sqlalchemy import inspect
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize database with all tables"""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully!")
        
        # List all created tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        logger.info(f"📋 Tables created: {', '.join(tables)}")
        
    except Exception as e:
        logger.error(f"❌ Error creating database tables: {e}")
        raise

if __name__ == "__main__":
    init_db()
