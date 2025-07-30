# Portfolio Website Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Git
- PostgreSQL (for production)

### Local Development Setup

#### 1. Clone and Setup Repository
```bash
git clone <your-repo-url>
cd portfolio-website
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.template .env
# Edit .env with your actual values

# Initialize database
python initialize_db.py

# Add sample data (optional)
python create_sample_data.py

# Start development server
uvicorn app.main:app --reload
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.template .env
# Edit .env with your actual values

# Start development server
npm start
```

### Environment Configuration

#### Backend (.env)
```env
DATABASE_URL=sqlite:///./portfolio_test.db
SECRET_KEY=your-super-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENVIRONMENT=development
```

## 🌐 Deployment

### GitHub Repository Setup

1. Create a new repository on GitHub
2. Add remote origin:
```bash
git remote add origin https://github.com/MDnoyon9758/modern-portfolio-template.git
git branch -M main
git push -u origin main
```

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

**Required Secrets:**
- `VERCEL_TOKEN` - Your Vercel API token

### Backend Deployment (Fly.io)

1. Install Fly CLI: [https://fly.io/docs/hands-on/install-flyctl/](https://fly.io/docs/hands-on/install-flyctl/)
2. Login: `flyctl auth login`
3. Create app: `flyctl apps create portfolio-backend`
4. Deploy: `flyctl deploy`

**Required Secrets:**
- `FLY_API_TOKEN` - Your Fly.io API token

### CI/CD Setup

The repository includes GitHub Actions workflows that automatically:
- Run tests on pull requests
- Deploy to production on main branch pushes
- Perform security scans

**Required GitHub Secrets:**
- `VERCEL_TOKEN` - For frontend deployment
- `FLY_API_TOKEN` - For backend deployment

## 🔧 Development Workflow

### Adding Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes
3. Test locally
4. Create pull request
5. Deploy after merge to main

### Database Changes
1. Create migration: `alembic revision --autogenerate -m "description"`
2. Apply migration: `alembic upgrade head`

### Testing
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && python -m pytest tests/
```

## 📚 Project Structure

```
portfolio-website/
├── frontend/           # React application
├── backend/           # FastAPI application
├── deployment/        # Deployment configurations
├── .github/          # CI/CD workflows
├── docs/             # Documentation
└── config/           # Environment templates
```

## 🛠️ Available Scripts

### Frontend
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Backend
- `uvicorn app.main:app --reload` - Development server
- `python initialize_db.py` - Initialize database
- `python create_sample_data.py` - Add sample data
- `python -m pytest tests/` - Run tests
- `black .` - Format code with Black
- `black --check .` - Check code formatting
- `ruff check .` - Run linting with Ruff
- `ruff check . --fix` - Fix linting issues

## 🔍 Troubleshooting

### Common Issues
1. **Database connection errors** - Check DATABASE_URL in .env
2. **CORS errors** - Verify BACKEND_CORS_ORIGINS includes frontend URL
3. **Email not sending** - Verify SMTP credentials
4. **Build failures** - Check Node.js and Python versions

### Getting Help
- Check the logs in backend/app.log
- Review GitHub Actions workflow results
- Ensure all environment variables are set correctly
