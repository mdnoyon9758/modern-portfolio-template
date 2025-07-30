import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.database import get_db, Base

# Test database URL (use SQLite for testing)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create test database tables
Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_read_main():
    """Test the main endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Portfolio API is running"}


def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_create_project():
    """Test creating a new project"""
    project_data = {
        "title": "Test Project",
        "description": "A test project for the portfolio",
        "short_description": "Test project",
        "technologies": '["Python", "FastAPI"]',
        "github_url": "https://github.com/user/test-project",
        "live_url": "https://test-project.com",
        "featured": True,
        "order_index": 1
    }
    
    response = client.post("/api/v1/projects/", json=project_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == project_data["title"]
    assert data["description"] == project_data["description"]
    assert "id" in data
    assert "created_at" in data


def test_read_projects():
    """Test reading projects"""
    response = client.get("/api/v1/projects/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_create_blog_post():
    """Test creating a new blog post"""
    blog_data = {
        "title": "Test Blog Post",
        "slug": "test-blog-post",
        "content": "This is a test blog post content.",
        "excerpt": "Test excerpt",
        "tags": '["testing", "fastapi"]',
        "published": True,
        "featured": False
    }
    
    response = client.post("/api/v1/blog/", json=blog_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == blog_data["title"]
    assert data["slug"] == blog_data["slug"]
    assert "id" in data


def test_contact_message():
    """Test creating a contact message"""
    contact_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "subject": "Test Message",
        "message": "This is a test contact message."
    }
    
    response = client.post("/api/v1/contact/", json=contact_data)
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "successfully" in data["message"]


def test_create_skill():
    """Test creating a new skill"""
    skill_data = {
        "name": "Python",
        "category": "Backend",
        "proficiency": 85,
        "order_index": 1
    }
    
    response = client.post("/api/v1/portfolio/skills", json=skill_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == skill_data["name"]
    assert data["category"] == skill_data["category"]
    assert data["proficiency"] == skill_data["proficiency"]


if __name__ == "__main__":
    pytest.main([__file__])
