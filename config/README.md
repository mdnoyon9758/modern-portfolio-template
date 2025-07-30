# Environment Configuration

This directory contains environment variable templates for different deployment scenarios.

## Files

- `.env.example` - Backend development environment
- `.env.production.example` - Backend production environment (Fly.io)
- `.env.frontend.example` - Frontend environment variables

## Setup Instructions

### Local Development

1. **Backend Environment**:
   ```bash
   cp config/.env.example backend/.env
   ```
   Then edit `backend/.env` with your local PostgreSQL credentials.

2. **Frontend Environment**:
   ```bash
   cp config/.env.frontend.example frontend/.env
   ```

### Production Deployment

1. **Fly.io Backend**:
   - Set environment variables using Fly CLI:
   ```bash
   flyctl secrets set DATABASE_URL=your_postgres_url
   flyctl secrets set SECRET_KEY=your_secret_key
   # ... other variables
   ```

2. **Vercel Frontend**:
   - Set environment variables in Vercel dashboard or using Vercel CLI:
   ```bash
   vercel env add VITE_API_URL
   ```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SECRET_KEY` | JWT secret key | Yes |
| `SMTP_HOST` | Email SMTP server | Yes |
| `SMTP_USER` | Email username | Yes |
| `SMTP_PASSWORD` | Email password/app password | Yes |
| `FROM_EMAIL` | Sender email address | Yes |
| `TO_EMAIL` | Recipient email for contact form | Yes |
| `BACKEND_CORS_ORIGINS` | Allowed frontend origins | Yes |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_ENVIRONMENT` | Environment identifier | No |

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong secret keys** - Generate with `openssl rand -hex 32`
3. **Use app passwords** - For Gmail, use app-specific passwords
4. **Separate environments** - Different secrets for dev/prod
5. **Rotate secrets regularly** - Especially in production

## Local PostgreSQL Setup

1. Install PostgreSQL locally
2. Create database:
   ```sql
   CREATE DATABASE portfolio_db;
   CREATE USER portfolio_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
   ```
3. Update `DATABASE_URL` in `.env`
