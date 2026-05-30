# HireX — AI-Powered Recruitment Platform

## What It Does
HireX connects students to jobs using AI matching. Students upload their resume, AI extracts their skills, and jobs are ranked by match score. Recruiters post jobs and see applicants ranked by AI compatibility score — saving time for both sides.

## Features
**Student:**
- Register/login with JWT auth
- Upload PDF resume — AI parses skills, education, experience automatically
- See jobs ranked by AI match score (highest match first)
- Each job shows % compatibility + AI analysis
- Apply to jobs, track application status
- Dashboard with charts: applications over time, status breakdown, skill radar

**Recruiter:**
- Post jobs with 3-step form
- See all applicants per job ranked by AI match score
- Top 3 applicants highlighted (gold/silver/bronze)
- Click any applicant → full profile drawer with matched/missing skills
- Update applicant status (shortlist/reject/hire) inline
- Dashboard with charts: applicants per job, hiring funnel

## Tech Stack
- Frontend: React 18, Vite, TailwindCSS, Framer Motion, Recharts, Zustand
- Backend: Node.js, Express.js, MongoDB, Mongoose
- AI: Google Gemini API (gemini-1.5-flash)
- Auth: JWT (access + refresh tokens)
- File: Multer (PDF upload), pdf-parse (text extraction)

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free at aistudio.google.com)

### Steps
1. Clone repo: git clone [your-repo-url]
2. Install all: `npm run install:all`
3. Setup server env: `cp server/.env.example server/.env` — fill in all values
4. Setup client env: `cp client/.env.example client/.env`
5. Run both: `npm run dev`
6. Open: http://localhost:5173

### Environment Variables

SERVER (/server/.env):
| Variable | Description |
|---|---|
| PORT | Server port (5000) |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret for access tokens (32+ chars) |
| JWT_REFRESH_SECRET | Secret for refresh tokens (different from above) |
| GEMINI_API_KEY | Google Gemini API key |
| CLIENT_URL | Frontend URL for CORS |

CLIENT (/client/.env):
| Variable | Description |
|---|---|
| VITE_API_URL | Backend API URL |

## Deploy to Render

### Option A: Two Services (Recommended)
1. Push code to GitHub
2. Go to render.com → New → Blueprint → select your repo
3. Render reads render.yaml and creates both services automatically
4. Add environment variables in Render dashboard for each service
5. Deploy

### Option B: Single Service
1. Update client/.env.production with your Render backend URL first
2. Build: `npm run build`
3. Push to GitHub
4. Create single Web Service on Render pointing to root
5. Build command: `npm run build`
6. Start command: `npm start`
7. Add all env variables

### Getting Your Keys
- MongoDB URI: mongodb.com/atlas → free cluster → connect → copy URI
- Gemini API Key: aistudio.google.com → Get API Key → free

## API Routes Reference

### Auth
POST /api/auth/register — { name, email, password, role }
POST /api/auth/login — { email, password }
POST /api/auth/refresh — refreshes access token
GET /api/auth/me — returns current user

### Student
GET /api/student/profile
PUT /api/student/profile
POST /api/student/resume/upload — multipart/form-data, field: resume
GET /api/student/jobs — returns jobs sorted by AI match score
POST /api/student/jobs/:id/apply
GET /api/student/applications
GET /api/student/dashboard/stats

### Recruiter
GET /api/recruiter/profile
PUT /api/recruiter/profile
POST /api/recruiter/jobs — create job
GET /api/recruiter/jobs — list own jobs
GET /api/recruiter/jobs/:id/applicants — ranked applicants
PUT /api/recruiter/jobs/:id/applicants/:studentId/status
GET /api/recruiter/dashboard/stats

## Future — Mobile App
This project is built as a REST API so a React Native mobile app can connect to the same backend with zero changes. All endpoints are mobile-ready.
