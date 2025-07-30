# Portfolio Backend API

FastAPI backend for personal portfolio website with PostgreSQL database.

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Configuration
```bash
# Copy environment template
cp ../config/.env.example .env

# Edit .env with your database credentials and email settings
```

### 3. Database Setup

#### Create PostgreSQL Database
```sql
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
```

#### Run Migrations
```bash
# Initialize Alembic (first time only)
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 4. Run the Application
```bash
# Development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Projects
- `GET /api/v1/projects/` - List all projects
- `GET /api/v1/projects/featured` - Get featured projects
- `GET /api/v1/projects/ordered` - Get projects ordered by index
- `POST /api/v1/projects/` - Create new project
- `GET /api/v1/projects/{id}` - Get project by ID
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project

### Blog Posts
- `GET /api/v1/blog/` - List all blog posts
- `GET /api/v1/blog/published` - Get published posts
- `GET /api/v1/blog/featured` - Get featured posts
- `POST /api/v1/blog/` - Create new post
- `GET /api/v1/blog/{id}` - Get post by ID
- `PUT /api/v1/blog/{id}` - Update post
- `DELETE /api/v1/blog/{id}` - Delete post

### Contact
- `POST /api/v1/contact/` - Submit contact form
- `GET /api/v1/contact/` - List messages (admin)
- `GET /api/v1/contact/{id}` - Get message by ID (admin)
- `PUT /api/v1/contact/{id}` - Update message (admin)
- `POST /api/v1/contact/{id}/read` - Mark as read (admin)
- `POST /api/v1/contact/test-email` - Test email config

### Portfolio Data
- `GET /api/v1/portfolio/skills` - Get skills
- `POST /api/v1/portfolio/skills` - Create skill
- `PUT /api/v1/portfolio/skills/{id}` - Update skill
- `DELETE /api/v1/portfolio/skills/{id}` - Delete skill
- `GET /api/v1/portfolio/experience` - Get experiences
- `POST /api/v1/portfolio/experience` - Create experience
- `PUT /api/v1/portfolio/experience/{id}` - Update experience
- `DELETE /api/v1/portfolio/experience/{id}` - Delete experience
- `GET /api/v1/portfolio/education` - Get education
- `POST /api/v1/portfolio/education` - Create education
- `PUT /api/v1/portfolio/education/{id}` - Update education
- `DELETE /api/v1/portfolio/education/{id}` - Delete education

## Database Models

### Project
- Personal projects with technologies, GitHub/live URLs
- Featured flag for homepage display
- Order index for custom sorting

### BlogPost
- Blog posts with slug, content, tags
- Published/draft status
- Featured posts for homepage
- Reading time estimation

### ContactMessage
- Contact form submissions
- Read/replied status tracking
- Automatic email notifications

### Skill
- Technical skills with proficiency levels
- Categorized (Frontend, Backend, etc.)
- Custom ordering

### Experience
- Work experience with dates
- Current position flag
- Technologies used

### Education
- Educational background
- Degrees and institutions
- GPA and achievements

### SiteSettings
- Key-value pairs for site configuration
- Dynamic content management

## Email Configuration

The API supports email notifications for contact form submissions:

1. Configure SMTP settings in `.env`
2. Use Gmail with app-specific passwords
3. Test configuration with `/contact/test-email` endpoint

## Development

### Create New Migration
```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

### Testing
```bash
pytest
```

## Production Deployment

See `../deployment/fly/` for Fly.io deployment configuration.
