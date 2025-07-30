from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Test OpenAPI docs
response = client.get('/api/v1/openapi.json')
print(f'OpenAPI JSON: {response.status_code}')

if response.status_code == 200:
    openapi_data = response.json()
    print(f'API Title: {openapi_data.get("info", {}).get("title")}')
    print(f'API Version: {openapi_data.get("info", {}).get("version")}')
    print(f'Available Paths: {len(openapi_data.get("paths", {}))}')
    
    # Show some endpoints
    paths = list(openapi_data.get('paths', {}).keys())
    print(f'All endpoints: {paths}')

print('\n=== OpenAPI documentation test completed! ===')
