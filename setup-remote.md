# Setting Up Remote Repository

## Option 1: GitHub (Recommended)

### Step 1: Create Repository on GitHub
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name: `portfolio-website`
4. Description: `Modern full-stack portfolio website with React + FastAPI`
5. Keep it **Public** or **Private** (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)

### Step 2: Connect Local Repository
```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git

# Rename main branch (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Set Up GitHub Secrets (for CI/CD)
1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `VERCEL_TOKEN`: Get from [Vercel Account Settings](https://vercel.com/account/tokens)
   - `FLY_API_TOKEN`: Get from [Fly.io Dashboard](https://fly.io/user/personal_access_tokens)

## Option 2: GitLab

### Step 1: Create Repository on GitLab
1. Go to [GitLab](https://gitlab.com)
2. Click "New project" → "Create blank project"
3. Project name: `portfolio-website`
4. **DO NOT** initialize with README

### Step 2: Connect Local Repository
```bash
# Add GitLab as remote
git remote add origin https://gitlab.com/YOUR_USERNAME/portfolio-website.git

# Push to GitLab
git push -u origin main
```

## Next Steps After Remote Setup

1. **Update SETUP.md** with your actual repository URL
2. **Set up deployment platforms**:
   - Vercel account for frontend
   - Fly.io account for backend
3. **Configure CI/CD secrets** in your repository settings
4. **Test the pipeline** by making a small change and pushing

## Repository URL Commands

Once you've set up the remote repository, update these commands in SETUP.md:

```bash
git clone https://github.com/YOUR_USERNAME/portfolio-website.git
# or
git clone https://gitlab.com/YOUR_USERNAME/portfolio-website.git
```

## Verification

After setting up the remote, verify it worked:
```bash
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/portfolio-website.git (fetch)
# origin  https://github.com/YOUR_USERNAME/portfolio-website.git (push)
```
