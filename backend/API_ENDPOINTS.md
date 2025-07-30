# Portfolio Website API Endpoints

This document outlines all the available API endpoints for the portfolio website backend.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
Most endpoints are public, but admin-only endpoints are noted below.

---

## 📝 Blog Posts

### Get All Blog Posts
- **GET** `/blog/`
- **Parameters**: `skip` (int), `limit` (int)
- **Description**: Retrieve all blog posts with pagination

### Get Published Blog Posts
- **GET** `/blog/published`
- **Description**: Retrieve only published blog posts

### Get Featured Blog Posts
- **GET** `/blog/featured`
- **Description**: Retrieve featured blog posts

### Get Blog Post by ID
- **GET** `/blog/{id}`
- **Description**: Get a specific blog post by ID

### Get Blog Post by Slug
- **GET** `/blog/slug/{slug}`
- **Description**: Get a specific blog post by its URL slug

### Create Blog Post
- **POST** `/blog/`
- **Body**: BlogPostCreate schema
- **Description**: Create a new blog post (admin only)

### Update Blog Post
- **PUT** `/blog/{id}`
- **Body**: BlogPostUpdate schema
- **Description**: Update a blog post (admin only)

### Delete Blog Post
- **DELETE** `/blog/{id}`
- **Description**: Delete a blog post (admin only)

---

## 🚀 Projects

### Get All Projects
- **GET** `/projects/`
- **Parameters**: `skip` (int), `limit` (int)
- **Description**: Retrieve all projects with pagination

### Get Featured Projects
- **GET** `/projects/featured`
- **Description**: Retrieve featured projects

### Get Ordered Projects
- **GET** `/projects/ordered`
- **Parameters**: `limit` (int, optional)
- **Description**: Retrieve projects ordered by order_index

### Get Project by ID
- **GET** `/projects/{id}`
- **Description**: Get a specific project by ID

### Create Project
- **POST** `/projects/`
- **Body**: ProjectCreate schema
- **Description**: Create a new project (admin only)

### Update Project
- **PUT** `/projects/{id}`
- **Body**: ProjectUpdate schema
- **Description**: Update a project (admin only)

### Delete Project
- **DELETE** `/projects/{id}`
- **Description**: Delete a project (admin only)

---

## 📞 Contact Messages

### Submit Contact Message
- **POST** `/contact/`
- **Body**: ContactMessageCreate schema
- **Description**: Submit a new contact message (public)

### Get All Contact Messages
- **GET** `/contact/`
- **Parameters**: `skip` (int), `limit` (int)
- **Description**: Retrieve all contact messages (admin only)

### Get Unread Messages
- **GET** `/contact/unread`
- **Description**: Retrieve unread contact messages (admin only)

### Get Unreplied Messages
- **GET** `/contact/unreplied`
- **Description**: Retrieve unreplied contact messages (admin only)

### Get Contact Message by ID
- **GET** `/contact/{id}`
- **Description**: Get a specific contact message (admin only)

### Update Contact Message
- **PUT** `/contact/{id}`
- **Body**: ContactMessageUpdate schema
- **Description**: Update a contact message (admin only)

### Mark Message as Read
- **POST** `/contact/{id}/read`
- **Description**: Mark a contact message as read (admin only)

### Mark Message as Replied
- **POST** `/contact/{id}/replied`
- **Description**: Mark a contact message as replied (admin only)

### Delete Contact Message
- **DELETE** `/contact/{id}`
- **Description**: Delete a contact message (admin only)

### Test Email Configuration
- **POST** `/contact/test-email`
- **Description**: Test email configuration (admin only)

---

## 🛠️ Skills

### Get All Skills
- **GET** `/skills/`
- **Parameters**: `skip` (int), `limit` (int)
- **Description**: Retrieve all skills with pagination

### Get Skills by Category
- **GET** `/skills/by-category`
- **Parameters**: `category` (string, optional)
- **Description**: Retrieve skills filtered by category

### Get Ordered Skills
- **GET** `/skills/ordered`
- **Description**: Retrieve skills ordered by order_index

### Get Skill by ID
- **GET** `/skills/{id}`
- **Description**: Get a specific skill by ID

### Create Skill
- **POST** `/skills/`
- **Body**: SkillCreate schema
- **Description**: Create a new skill (admin only)

### Update Skill
- **PUT** `/skills/{id}`
- **Body**: SkillUpdate schema
- **Description**: Update a skill (admin only)

### Delete Skill
- **DELETE** `/skills/{id}`
- **Description**: Delete a skill (admin only)

---

## 💼 Experience

### Get All Experience
- **GET** `/experience/`
- **Parameters**: `skip` (int), `limit` (int)
- **Description**: Retrieve all experience records with pagination

### Get Ordered Experience
- **GET** `/experience/ordered`
- **Description**: Retrieve experience records ordered by order_index

### Get Current Experience
- **GET** `/experience/current`
- **Description**: Retrieve current experience records

### Get Experience by ID
- **GET** `/experience/{id}`
- **Description**: Get a specific experience record by ID

### Create Experience
- **POST** `/experience/`
- **Body**: ExperienceCreate schema
- **Description**: Create a new experience record (admin only)

### Update Experience
- **PUT** `/experience/{id}`
- **Body**: ExperienceUpdate schema
- **Description**: Update an experience record (admin only)

### Delete Experience
- **DELETE** `/experience/{id}`
- **Description**: Delete an experience record (admin only)

---

## 🎓 Education

### Get All Education
- **GET** `/education/`
- **Parameters**: `skip` (int), `limit` (int)
- **Description**: Retrieve all education records with pagination

### Get Ordered Education
- **GET** `/education/ordered`
- **Description**: Retrieve education records ordered by order_index

### Get Current Education
- **GET** `/education/current`
- **Description**: Retrieve current education records

### Get Education by ID
- **GET** `/education/{id}`
- **Description**: Get a specific education record by ID

### Create Education
- **POST** `/education/`
- **Body**: EducationCreate schema
- **Description**: Create a new education record (admin only)

### Update Education
- **PUT** `/education/{id}`
- **Body**: EducationUpdate schema
- **Description**: Update an education record (admin only)

### Delete Education
- **DELETE** `/education/{id}`
- **Description**: Delete an education record (admin only)

---

## ⚙️ Site Settings

### Get All Site Settings
- **GET** `/site-settings/`
- **Parameters**: `skip` (int), `limit` (int)
- **Description**: Retrieve all site settings (admin only)

### Get Site Setting by Key
- **GET** `/site-settings/key/{key}`
- **Description**: Get a specific site setting by key (admin only)

### Get Site Setting by ID
- **GET** `/site-settings/{id}`
- **Description**: Get a specific site setting by ID (admin only)

### Create Site Setting
- **POST** `/site-settings/`
- **Body**: SiteSettingsCreate schema
- **Description**: Create a new site setting (admin only)

### Update Site Setting
- **PUT** `/site-settings/{id}`
- **Body**: SiteSettingsUpdate schema
- **Description**: Update a site setting (admin only)

### Delete Site Setting
- **DELETE** `/site-settings/{id}`
- **Description**: Delete a site setting (admin only)

---

## 📊 Response Formats

### Success Response
```json
{
  "data": [...],
  "status": "success"
}
```

### Error Response
```json
{
  "detail": "Error message",
  "status": "error"
}
```

---

## 🔧 Data Models

### BlogPost
```json
{
  "id": 1,
  "title": "Sample Blog Post",
  "slug": "sample-blog-post",
  "content": "Blog post content...",
  "excerpt": "Short excerpt...",
  "tags": "tag1,tag2,tag3",
  "featured_image": "https://example.com/image.jpg",
  "published": true,
  "featured": false,
  "reading_time": 5,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "published_at": "2023-01-01T00:00:00Z"
}
```

### Project
```json
{
  "id": 1,
  "title": "Sample Project",
  "description": "Project description...",
  "short_description": "Short description...",
  "technologies": "React,Node.js,MongoDB",
  "github_url": "https://github.com/user/project",
  "live_url": "https://project.com",
  "image_url": "https://example.com/image.jpg",
  "featured": true,
  "order_index": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

### ContactMessage
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Contact Subject",
  "message": "Contact message...",
  "read": false,
  "replied": false,
  "created_at": "2023-01-01T00:00:00Z"
}
```

### Skill
```json
{
  "id": 1,
  "name": "React",
  "category": "Frontend",
  "proficiency": 85,
  "icon_url": "https://example.com/react-icon.png",
  "order_index": 1,
  "created_at": "2023-01-01T00:00:00Z"
}
```

### Experience
```json
{
  "id": 1,
  "company": "Tech Company",
  "position": "Software Developer",
  "description": "Job description...",
  "technologies": "React,Node.js,MongoDB",
  "start_date": "2023-01-01T00:00:00Z",
  "end_date": null,
  "current": true,
  "company_url": "https://company.com",
  "location": "Remote",
  "order_index": 1,
  "created_at": "2023-01-01T00:00:00Z"
}
```

### Education
```json
{
  "id": 1,
  "institution": "University Name",
  "degree": "Bachelor of Science",
  "field_of_study": "Computer Science",
  "description": "Education description...",
  "start_date": "2019-01-01T00:00:00Z",
  "end_date": "2023-01-01T00:00:00Z",
  "current": false,
  "gpa": "3.8",
  "location": "City, State",
  "order_index": 1,
  "created_at": "2023-01-01T00:00:00Z"
}
```

### SiteSettings
```json
{
  "id": 1,
  "key": "site_title",
  "value": "My Portfolio",
  "description": "The main title of the website",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

---

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Initialize the database:**
   ```bash
   cd backend
   python initialize_db.py
   ```

3. **Test the endpoints:**
   ```bash
   cd backend
   python test_endpoints.py
   ```

4. **View API documentation:**
   Visit `http://localhost:8000/docs` for interactive Swagger documentation

---

## 🔒 Security Notes

- All admin endpoints require authentication
- Input validation is performed on all endpoints
- SQL injection protection is implemented
- CORS is configured for frontend domains
- Email notifications are handled securely

---

## 📈 Recent Improvements

✅ **Completed Issues:**

1. **Backend API endpoints missing for blog and project CRUD operations**
   - All CRUD operations now implemented for blogs and projects
   - Added slug-based blog post retrieval
   - Enhanced filtering and ordering options

2. **Site settings page missing**
   - Complete site settings management system
   - Key-value based configuration
   - Get settings by key or ID
   - Full CRUD operations

3. **Contact message management improvements**
   - Enhanced filtering (unread, unreplied)
   - Mark as read/replied functionality
   - Email notification system
   - Admin-only access controls

4. **Additional enhancements:**
   - Skills management system
   - Experience tracking
   - Education records
   - Database initialization script
   - Comprehensive API testing
   - Complete documentation
