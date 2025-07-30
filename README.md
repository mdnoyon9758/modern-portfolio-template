# Personal Portfolio Website 🚀

**A comprehensive, secure, and modern full-stack portfolio website** built with enhanced UI/UX, advanced security features, and comprehensive logging.

✨ **Recently Enhanced with:**
- 🎨 Advanced animations and UI components
- 🔒 Comprehensive security features and middleware
- 🌍 Internationalization (i18n) support
- 📊 Enhanced logging and monitoring
- ⚡ Performance optimizations
- 🛡️ HTTPS enforcement and security headers

## Project Structure

```
portfolio-website/
├── frontend/                 # React + TailwindCSS frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      # Header, Footer, Navigation
│   │   │   ├── ui/          # Reusable UI components
│   │   │   └── forms/       # Contact form, etc.
│   │   ├── pages/           # Home, About, Projects, Blog, Contact
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API calls
│   │   ├── contexts/        # Theme context, etc.
│   │   ├── utils/           # Helper functions
│   │   └── assets/          # Images, icons
│   └── package.json
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/v1/endpoints/ # API routes
│   │   ├── core/            # Configuration, security
│   │   ├── db/              # Database connection
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utilities
│   ├── alembic/             # Database migrations
│   ├── tests/
│   └── requirements.txt
├── deployment/
│   ├── vercel/              # Vercel deployment config
│   └── fly/                 # Fly.io deployment config
├── config/                  # Environment configurations
└── docs/                    # Documentation
```

## Features

- 🏠 **Home**: Hero section with introduction
- 👤 **About**: Personal information and skills
- 🚀 **Projects**: Dynamic project showcase from database
- 📝 **Blog**: Dynamic blog posts from database
- 📧 **Contact**: Form with email notifications
- 🌙 **Dark/Light Mode**: Toggle theme
- 📱 **Responsive Design**: Mobile-first approach

## Tech Stack

### Frontend
- React.js 18
- TailwindCSS
- React Router
- Axios
- React Query

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic (migrations)
- Pydantic
- Python-multipart

### Deployment
- Frontend: Vercel
- Backend: Fly.io with PostgreSQL addon

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

## Environment Variables

See `config/` directory for environment variable templates.

## Deployment

Detailed deployment instructions are in the `deployment/` directory.
