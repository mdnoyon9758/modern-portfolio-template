from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_basic_endpoints():
    print('=== Testing Basic Endpoints ===')
    response = client.get('/')
    print(f'GET /: {response.status_code} - {response.json()}')

    response = client.get('/health')
    print(f'GET /health: {response.status_code} - {response.json()}')

def test_projects_api():
    print('\n=== Testing Projects API ===')
    project_data = {
        'title': 'Portfolio Website',
        'description': 'A full-stack portfolio website built with React and FastAPI',
        'short_description': 'Portfolio website project',
        'technologies': '["React", "FastAPI", "PostgreSQL", "TailwindCSS"]',
        'github_url': 'https://github.com/user/portfolio',
        'live_url': 'https://portfolio.vercel.app',
        'featured': True,
        'order_index': 1
    }

    response = client.post('/api/v1/projects/', json=project_data)
    print(f'POST /api/v1/projects/: {response.status_code}')
    if response.status_code == 200:
        project_id = response.json().get('id')
        print(f'  Created project ID: {project_id}')
    else:
        print(f'  Error: {response.json()}')

    response = client.get('/api/v1/projects/')
    print(f'GET /api/v1/projects/: {response.status_code} - Found {len(response.json())} projects')

    response = client.get('/api/v1/projects/featured')
    print(f'GET /api/v1/projects/featured: {response.status_code} - Found {len(response.json())} featured projects')

def test_blog_api():
    print('\n=== Testing Blog API ===')
    blog_data = {
        'title': 'Getting Started with FastAPI',
        'slug': 'getting-started-with-fastapi',
        'content': 'FastAPI is a modern, fast web framework for building APIs with Python...',
        'excerpt': 'Learn how to build APIs with FastAPI',
        'tags': '["python", "fastapi", "web-development"]',
        'published': True,
        'featured': True,
        'reading_time': 5
    }

    response = client.post('/api/v1/blog/', json=blog_data)
    print(f'POST /api/v1/blog/: {response.status_code}')
    if response.status_code == 200:
        blog_id = response.json().get('id')
        print(f'  Created blog post ID: {blog_id}')

    response = client.get('/api/v1/blog/published')
    print(f'GET /api/v1/blog/published: {response.status_code} - Found {len(response.json())} published posts')

def test_contact_api():
    print('\n=== Testing Contact API ===')
    contact_data = {
        'name': 'John Doe',
        'email': 'john.doe@example.com',
        'subject': 'Hello from API test',
        'message': 'This is a test message from the API testing script.'
    }

    response = client.post('/api/v1/contact/', json=contact_data)
    print(f'POST /api/v1/contact/: {response.status_code}')
    if response.status_code == 200:
        print(f'  Message: {response.json().get("message")}')

    response = client.get('/api/v1/contact/')
    print(f'GET /api/v1/contact/: {response.status_code} - Found {len(response.json())} messages')

def test_portfolio_api():
    print('\n=== Testing Portfolio API ===')
    
    # Test skills
    skill_data = {
        'name': 'Python',
        'category': 'Backend',
        'proficiency': 90,
        'order_index': 1
    }

    response = client.post('/api/v1/portfolio/skills', json=skill_data)
    print(f'POST /api/v1/portfolio/skills: {response.status_code}')

    response = client.get('/api/v1/portfolio/skills')
    print(f'GET /api/v1/portfolio/skills: {response.status_code} - Found {len(response.json())} skills')

if __name__ == "__main__":
    test_basic_endpoints()
    test_projects_api()
    test_blog_api()
    test_contact_api()
    test_portfolio_api()
    print('\n=== All API tests completed! ===')
