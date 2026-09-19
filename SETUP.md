# Setup Guide

## 1. Copy environment template
```bash
cp .env.example .env
```
On Windows PowerShell use `Copy-Item .env.example .env`.
Set a random `JWT_SECRET` of at least 32 characters.

## 2. Start databases
Preferred:
```bash
docker compose up -d postgres mongodb
```
Or start PostgreSQL and MongoDB locally with the connection values from `.env`.

## 3. Start backend
```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cd ..
uvicorn app.main:app --app-dir backend --reload
```

## 4. Create an administrator
Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` only in your shell, then:
```bash
python backend/scripts/create_admin.py
```

## 5. Start frontend
```bash
cd frontend
npm install
npm run dev
```

## 6. Test
```bash
cd backend
PYTHONPATH=. pytest -q
```
