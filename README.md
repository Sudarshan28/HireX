<h1 align="center">🚀 HireX</h1>

<p align="center">
  <b>Smart Recruitment System with AI-Powered Resume Matching</b>
</p>

<p align="center">
HireX is a full-stack MERN application that streamlines the recruitment process for students and recruiters using AI-driven resume analysis, intelligent job matching, and recruiter analytics.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-blue?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge)

</p>

---

# 📌 Overview

Hiring the right candidate is often time-consuming due to manual resume screening and inefficient job matching.

HireX solves this problem by providing an AI-assisted recruitment platform where:

- 🎓 Students receive personalized job recommendations based on their resumes.
- 👨‍💼 Recruiters discover the best candidates using AI compatibility scores.
- 🤖 Gemini AI extracts skills and experience automatically from uploaded resumes.
- 📊 Interactive dashboards help both students and recruiters make informed decisions.

The platform focuses on making recruitment faster, smarter, and more transparent.

---

# ✨ Key Features

## 👨‍🎓 Student Portal

- Secure Registration & Login
- JWT Authentication
- Resume Upload (PDF)
- AI Resume Parsing
- Automatic Skill Extraction
- Education & Experience Detection
- AI Job Matching
- Compatibility Score
- AI-generated Resume Analysis
- One-click Job Application
- Application Tracking
- Dashboard Analytics
- Skill Radar Chart
- Application Status Overview

---

## 👩‍💼 Recruiter Portal

- Recruiter Authentication
- Create Job Posts
- Manage Job Listings
- AI Candidate Ranking
- Gold / Silver / Bronze Candidate Labels
- Candidate Profile Drawer
- Skill Gap Analysis
- Candidate Status Management
- Hiring Analytics Dashboard
- Hiring Funnel Visualization
- Applicant Statistics

---

# 🧠 AI Features

HireX uses **Google Gemini AI** to provide intelligent recruitment capabilities.

### AI Resume Parsing

- Extract Skills
- Extract Education
- Extract Experience
- Resume Understanding

### AI Matching

- Candidate vs Job Comparison
- Compatibility Score Generation
- Explainable AI Analysis
- Skill Gap Identification
- Personalized Job Recommendations

---

# 📷 Screenshots

> Replace these placeholders with screenshots after uploading them to your repository.

## Landing Page

![Landing](assets/screenshots/home.png)

---

## Student Dashboard

![Student Dashboard](assets/screenshots/student-dashboard.png)

---

## Recruiter Dashboard

![Recruiter Dashboard](assets/screenshots/recruiter-dashboard.png)

---

## AI Resume Analysis

![Resume Analysis](assets/screenshots/resume-analysis.png)

---

## Applicant Ranking

![Applicant Ranking](assets/screenshots/ranking.png)

---

## Analytics Dashboard

![Analytics](assets/screenshots/analytics.png)

---

# 🏗️ System Architecture

```text
                    +----------------------+
                    |      React App       |
                    |   (Student Portal)   |
                    +----------+-----------+
                               |
                               |
                    REST API Requests
                               |
                               ▼
                    +----------------------+
                    |    Express Server    |
                    +----------+-----------+
                               |
        +----------------------+----------------------+
        |                                             |
        ▼                                             ▼
+---------------------+                  +-----------------------+
|    MongoDB Atlas    |                  |    Google Gemini AI   |
|  Users • Jobs • DB  |                  | Resume Intelligence   |
+---------------------+                  +-----------------------+
```

---

# 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI | Google Gemini API |
| Authentication | JWT Access Token, JWT Refresh Token |
| File Upload | Multer |
| Resume Parsing | pdf-parse |
| State Management | Zustand |
| Charts | Recharts |
| Animation | Framer Motion |
| Deployment | Render |

---

# 📁 Project Structure

```text
HireX
│
├── client
│   ├── src
│   ├── public
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   └── store
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── config
│
├── assets
│   └── screenshots
│
├── render.yaml
├── package.json
└── README.md
```

---

# ⭐ Project Highlights

- ✅ Full Stack MERN Application
- ✅ AI-Powered Resume Analysis
- ✅ Intelligent Job Matching
- ✅ Recruiter Analytics Dashboard
- ✅ JWT Authentication
- ✅ Resume Upload System
- ✅ AI Compatibility Scores
- ✅ Responsive User Interface
- ✅ MongoDB Atlas Integration
- ✅ Google Gemini AI Integration
- ✅ Production Deployment on Render

---

# 🔥 Why HireX?

Unlike traditional recruitment systems, HireX introduces AI-assisted hiring by automatically understanding resumes, identifying skills, comparing candidates against job descriptions, and recommending the most suitable opportunities.

The platform reduces manual screening effort while improving hiring accuracy through intelligent compatibility scoring.

---
