Scholarship Management System - Submission README

Project Type:
- React (Vite) frontend
- FastAPI backend
- SQLite database

Folder Contents:
- Frontend source: src/
- Backend source: backend/
- Database file: backend/app.db

How to Run (Local Development):
1) Backend
   cd backend
   ../.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

2) Frontend
   cd ..
   npm install
   npm run dev

Login Credentials (Seeded Accounts):
- Admin: admin@example.com / admin123
- Student: student@example.com / student123
- Reviewer: reviewer@example.com / reviewer123
- Committee: committee@example.com / committee123

Notes:
- Password hashing has been disabled for demo simplicity. Passwords are stored in plain text.
- CORS is configured to allow all origins during development.

