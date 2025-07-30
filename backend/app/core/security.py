"""
Enhanced Security Module
Provides comprehensive security features including authentication, 
rate limiting, input validation, and security headers.
"""

import hashlib
import secrets
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional, Union, List
from urllib.parse import urlparse

import jwt
from fastapi import HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from passlib.hash import bcrypt
import re

from app.core.config import settings

# Set up logging for security events
security_logger = logging.getLogger("security")
security_logger.setLevel(logging.INFO)
handler = logging.FileHandler("security.log")
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
security_logger.addHandler(handler)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Security
security = HTTPBearer()

class SecurityManager:
    """
    Comprehensive security manager for the application
    Handles authentication, rate limiting, and security validations
    """
    
    def __init__(self):
        self.failed_login_attempts = {}
        self.rate_limit_storage = {}
        
    def create_access_token(
        self, 
        subject: Union[str, Any], 
        expires_delta: timedelta = None,
        additional_claims: Dict[str, Any] = None
    ) -> str:
        """
        Create a JWT access token with enhanced security
        """
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        # Ensure session timeout
        session_timeout = datetime.utcnow() + timedelta(minutes=30)  # 30 minutes session timeout
        
        # Base payload
        payload = {
            "exp": expire,
            "iat": datetime.utcnow(),
            "sub": str(subject),
            "jti": secrets.token_urlsafe(32),  # JWT ID for token blacklisting
            "session_exp": session_timeout.timestamp()  # Add session expiration
        }
        
        # Add additional claims if provided
        if additional_claims:
            payload.update(additional_claims)
        
        # Log token creation
        security_logger.info(f"Access token created for subject: {subject}")
        
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify and decode JWT token with enhanced security checks
        """
        try:
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=[settings.ALGORITHM]
            )
            
            # Additional security checks
            if payload.get("exp") < datetime.utcnow().timestamp():
                security_logger.warning("Expired token used")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token expired"
                )
                
            return payload
            
        except jwt.ExpiredSignatureError:
            security_logger.warning("Expired token verification attempted")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired"
            )
        except jwt.JWTError as e:
            security_logger.error(f"JWT verification failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
    
    def hash_password(self, password: str) -> str:
        """
        Hash password with bcrypt and additional security measures
        """
        # Validate password strength
        if not self.validate_password_strength(password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password does not meet security requirements"
            )
        
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify password with rate limiting for failed attempts
        """
        return pwd_context.verify(plain_password, hashed_password)
    
    def validate_password_strength(self, password: str) -> bool:
        """
        Validate password strength according to security best practices
        - At least 8 characters
        - Contains uppercase and lowercase letters
        - Contains at least one digit
        - Contains at least one special character
        """
        if len(password) < 8:
            return False
        
        patterns = [
            r'[A-Z]',  # Uppercase letter
            r'[a-z]',  # Lowercase letter
            r'\d',     # Digit
            r'[!@#$%^&*(),.?\":{}|<>]'  # Special character
        ]
        
        return all(re.search(pattern, password) for pattern in patterns)
    
    def rate_limit_check(
        self, 
        request: Request, 
        max_requests: int = 100, 
        window_minutes: int = 60
    ) -> bool:
        """
        Check if request should be rate limited
        """
        client_ip = self.get_client_ip(request)
        current_time = datetime.utcnow()
        window_start = current_time - timedelta(minutes=window_minutes)
        
        # Clean old entries
        if client_ip in self.rate_limit_storage:
            self.rate_limit_storage[client_ip] = [
                timestamp for timestamp in self.rate_limit_storage[client_ip]
                if timestamp > window_start
            ]
        else:
            self.rate_limit_storage[client_ip] = []
        
        # Check if limit exceeded
        if len(self.rate_limit_storage[client_ip]) >= max_requests:
            security_logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return False
        
        # Add current request
        self.rate_limit_storage[client_ip].append(current_time)
        return True
    
    def track_failed_login(self, identifier: str) -> bool:
        """
        Track failed login attempts and implement progressive delays
        """
        current_time = datetime.utcnow()
        
        if identifier not in self.failed_login_attempts:
            self.failed_login_attempts[identifier] = []
        
        # Clean old attempts (older than 1 hour)
        self.failed_login_attempts[identifier] = [
            attempt for attempt in self.failed_login_attempts[identifier]
            if current_time - attempt < timedelta(hours=1)
        ]
        
        # Add current failed attempt
        self.failed_login_attempts[identifier].append(current_time)
        
        # Check if account should be locked
        attempt_count = len(self.failed_login_attempts[identifier])
        if attempt_count >= 5:
            security_logger.error(f"Account lockout triggered for: {identifier}")
            return False
        
        return True
    
    def validate_email(self, email: str) -> bool:
        """
        Validate email format with comprehensive regex
        """
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def sanitize_input(self, input_text: str) -> str:
        """
        Sanitize user input to prevent XSS and injection attacks
        """
        if not input_text:
            return ""
        
        # Remove or escape potentially dangerous characters
        dangerous_chars = ['<', '>', '"', "'", '&', 'javascript:', 'onload=', 'onerror=']
        sanitized = input_text
        
        for char in dangerous_chars:
            if char.lower() in sanitized.lower():
                sanitized = sanitized.replace(char, "")
        
        return sanitized.strip()
    
    def validate_url(self, url: str) -> bool:
        """
        Validate URL format and check for suspicious patterns
        """
        try:
            parsed = urlparse(url)
            
            # Check for valid scheme
            if parsed.scheme not in ['http', 'https']:
                return False
            
            # Check for suspicious patterns
            suspicious_patterns = [
                'javascript:', 'data:', 'vbscript:', 'file:',
                'localhost', '127.0.0.1', '0.0.0.0'
            ]
            
            url_lower = url.lower()
            return not any(pattern in url_lower for pattern in suspicious_patterns)
            
        except Exception:
            return False
    
    def get_client_ip(self, request: Request) -> str:
        """
        Get client IP address, considering proxy headers
        """
        # Check for forwarded headers (in order of preference)
        forwarded_headers = [
            'HTTP_CF_CONNECTING_IP',  # Cloudflare
            'HTTP_X_FORWARDED_FOR',   # Standard proxy header
            'HTTP_X_REAL_IP',         # Nginx
            'HTTP_X_FORWARDED',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED'
        ]
        
        for header in forwarded_headers:
            if header in request.headers:
                # Take the first IP if multiple are present
                ip = request.headers[header].split(',')[0].strip()
                if self.is_valid_ip(ip):
                    return ip
        
        # Fallback to direct connection IP
        return request.client.host if request.client else "unknown"
    
    def is_valid_ip(self, ip: str) -> bool:
        """
        Validate IP address format
        """
        import ipaddress
        try:
            ipaddress.ip_address(ip)
            return True
        except ValueError:
            return False
    
    def generate_csrf_token(self) -> str:
        """
        Generate CSRF token for form protection
        """
        return secrets.token_urlsafe(32)
    
    def validate_csrf_token(self, token: str, stored_token: str) -> bool:
        """
        Validate CSRF token
        """
        return secrets.compare_digest(token, stored_token)

# Global security manager instance
security_manager = SecurityManager()

def get_password_hash(password: str) -> str:
    """Wrapper function for password hashing"""
    return security_manager.hash_password(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Wrapper function for password verification"""
    return security_manager.verify_password(plain_password, hashed_password)

def create_access_token(
    subject: Union[str, Any], 
    expires_delta: timedelta = None
) -> str:
    """Wrapper function for token creation"""
    return security_manager.create_access_token(subject, expires_delta)

def verify_token(token: str) -> Dict[str, Any]:
    """Wrapper function for token verification"""
    return security_manager.verify_token(token)

# Security headers for HTTP responses
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}
