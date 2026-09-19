# ResearchSphere AI - Installation & Local Setup Guide

This guide provides instructions for setting up and running ResearchSphere AI locally or using Docker.

---

## System Prerequisites
- **Python**: Version 3.11 or higher
- **Node.js**: Version 18.x or 20.x
- **PostgreSQL**: Version 16.x (Listening on port 5433 or 5432)
- **MongoDB**: Version 7.x (Listening on port 27017)
- **Docker & Docker Compose** (Optional, recommended for automated container deployment)

---

## Option A: Docker Deployment (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/Nithya21shree/InnovaFund-AI.git
cd InnovaFund-AI

# 2. Build and start containers
docker-compose up -d --build

# 3. Verify container status
docker-compose ps
```

The application will be accessible at:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000/docs`

---

## Option B: Manual Local Development Setup

### 1. Database Setup
Ensure PostgreSQL and MongoDB services are running:
- PostgreSQL DB Name: `funding_innovation_platform`
- PostgreSQL User/Pass: `postgres` / `postgres`

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI development server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

---

## Default Login Credentials (Seeded on Startup)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@researchsphere.ai` | `Admin@123456` |

---

## Educational Breakdown

### 1. What was created
- Comprehensive installation guide covering Docker multi-container launch, local manual installation steps for Linux/macOS/Windows, environment prerequisites, and seed account credentials.

### 2. Why it is needed
- Standardized onboarding procedures prevent environment mismatch issues and allow developers and QA engineers to quickly launch the platform.

### 3. How it works
- Documents step-by-step commands to provision virtual environments, install npm packages, seed initial roles, and launch servers.

### 4. Which files were added
- [`docs/INSTALLATION_GUIDE.md`](file:///c:/Users/mayan/OneDrive/Documents/GitHub/InnovaFund-AI/docs/INSTALLATION_GUIDE.md)

### 5. How to run it
- Follow instructions line-by-line in terminal.

### 6. Industry best practices
- Containerize all dependencies (DBs + apps) using Docker Compose for reproducible builds across dev and production environments.

### 7. Common mistakes to avoid
- Forgetting to create the target PostgreSQL database before running SQLAlchemy migrations locally.
