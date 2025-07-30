#!/usr/bin/env python3
"""
Test script to verify API endpoints are working correctly.
"""

import asyncio
import aiohttp
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000/api/v1"

async def test_endpoint(session, endpoint, method="GET", data=None):
    """Test a single endpoint"""
    try:
        url = f"{BASE_URL}{endpoint}"
        if method == "GET":
            async with session.get(url) as response:
                status = response.status
                if status == 200:
                    result = await response.json()
                else:
                    result = await response.text()
        elif method == "POST":
            async with session.post(url, json=data) as response:
                status = response.status
                if status in [200, 201]:
                    result = await response.json()
                else:
                    result = await response.text()
        
        logger.info(f"✅ {method} {endpoint}: {status}")
        return True
    except Exception as e:
        logger.error(f"❌ {method} {endpoint}: {str(e)}")
        return False

async def test_all_endpoints():
    """Test all major endpoints"""
    endpoints_to_test = [
        # Blog endpoints
        ("/blog/", "GET"),
        ("/blog/published", "GET"),
        ("/blog/featured", "GET"),
        
        # Project endpoints
        ("/projects/", "GET"),
        ("/projects/featured", "GET"),
        ("/projects/ordered", "GET"),
        
        # Contact endpoints
        ("/contact/", "GET"),
        ("/contact/unread", "GET"),
        ("/contact/unreplied", "GET"),
        
        # Skills endpoints
        ("/skills/", "GET"),
        ("/skills/ordered", "GET"),
        ("/skills/by-category", "GET"),
        
        # Experience endpoints
        ("/experience/", "GET"),
        ("/experience/ordered", "GET"),
        ("/experience/current", "GET"),
        
        # Education endpoints
        ("/education/", "GET"),
        ("/education/ordered", "GET"),
        ("/education/current", "GET"),
        
        # Site settings endpoints
        ("/site-settings/", "GET"),
    ]
    
    # Sample data for POST tests
    sample_contact = {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a test message"
    }
    
    sample_site_setting = {
        "key": "test_setting",
        "value": "test_value",
        "description": "Test setting description"
    }
    
    post_tests = [
        ("/contact/", "POST", sample_contact),
        ("/site-settings/", "POST", sample_site_setting),
    ]
    
    logger.info("🚀 Starting API endpoint tests...")
    
    async with aiohttp.ClientSession() as session:
        success_count = 0
        total_tests = len(endpoints_to_test) + len(post_tests)
        
        # Test GET endpoints
        for endpoint, method in endpoints_to_test:
            if await test_endpoint(session, endpoint, method):
                success_count += 1
        
        # Test POST endpoints
        for endpoint, method, data in post_tests:
            if await test_endpoint(session, endpoint, method, data):
                success_count += 1
        
        logger.info(f"📊 Test Results: {success_count}/{total_tests} endpoints working")
        
        if success_count == total_tests:
            logger.info("🎉 All tests passed!")
        else:
            logger.warning(f"⚠️  {total_tests - success_count} tests failed")

if __name__ == "__main__":
    print("📝 This script tests API endpoints.")
    print("⚠️  Make sure the FastAPI server is running on localhost:8000")
    print("💡 Start the server with: uvicorn app.main:app --reload")
    print()
    
    response = input("Continue with tests? (y/n): ")
    if response.lower() in ['y', 'yes']:
        asyncio.run(test_all_endpoints())
    else:
        print("Tests cancelled.")
