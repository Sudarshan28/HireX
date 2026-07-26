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

# 🚀 Getting Started

Follow these steps to run HireX locally.

---

## Prerequisites

Before you begin, make sure you have:

- Node.js (v18 or later)
- npm
- MongoDB Atlas Account
- Google Gemini API Key
- Git

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/HireX.git

cd HireX
```

---

## 2️⃣ Install Dependencies

Install all frontend and backend dependencies.

```bash
npm run install:all
```

---

## 3️⃣ Configure Environment Variables

### Server

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

GEMINI_API_KEY=

CLIENT_URL=http://localhost:5173
```

---

### Client

Create a `.env` file inside the **client** folder.

```env
VITE_API_URL=http://localhost:5000
```

---

## 4️⃣ Run the Project

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 🔐 Authentication

HireX uses **JWT Authentication**.

Features include:

- User Registration
- Secure Login
- Access Tokens
- Refresh Tokens
- Protected Routes
- Role-based Authorization

Supported Roles

- Student
- Recruiter

---

# 📄 Resume Processing Workflow

```text
Upload Resume (PDF)
        │
        ▼
PDF Parsing
        │
        ▼
Gemini AI Processing
        │
        ▼
Extract Skills
Education
Experience
Projects
        │
        ▼
Generate Candidate Profile
        │
        ▼
Compare with Jobs
        │
        ▼
AI Compatibility Score
```

---

# 📊 Recruiter Workflow

```text
Recruiter Login
        │
        ▼
Create Job Posting
        │
        ▼
Students Apply
        │
        ▼
AI Scores Every Applicant
        │
        ▼
Rank Candidates
        │
        ▼
Review Skill Gaps
        │
        ▼
Shortlist / Reject / Hire
```

---

# 📡 REST API

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| POST | `/api/auth/refresh` | Refresh Token |
| GET | `/api/auth/me` | Get Current User |

---

## Student APIs

| Method | Endpoint |
|---------|----------|
| GET | `/api/student/profile` |
| PUT | `/api/student/profile` |
| POST | `/api/student/resume/upload` |
| GET | `/api/student/jobs` |
| POST | `/api/student/jobs/:id/apply` |
| GET | `/api/student/applications` |
| GET | `/api/student/dashboard/stats` |

---

## Recruiter APIs

| Method | Endpoint |
|---------|----------|
| GET | `/api/recruiter/profile` |
| PUT | `/api/recruiter/profile` |
| POST | `/api/recruiter/jobs` |
| GET | `/api/recruiter/jobs` |
| GET | `/api/recruiter/jobs/:id/applicants` |
| PUT | `/api/recruiter/jobs/:id/applicants/:studentId/status` |
| GET | `/api/recruiter/dashboard/stats` |

---

# 🌍 Deployment

HireX is configured for deployment on **Render**.

## Blueprint Deployment

1. Push your repository to GitHub
2. Open Render Dashboard
3. Create a Blueprint
4. Connect your repository
5. Render automatically detects `render.yaml`
6. Add environment variables
7. Deploy

---

## Manual Deployment

Update frontend environment variable.

```env
VITE_API_URL=https://your-backend.onrender.com
```

Build the project.

```bash
npm run build
```

Deploy backend as a Render Web Service.

---

# 📈 Future Improvements

- AI Resume Feedback
- Interview Scheduling
- Email Notifications
- Company Profiles
- Resume Templates
- Resume Builder
- Multi-language Support
- AI Chatbot Assistant
- Mobile Application
- Calendar Integration
- Interview Feedback System
- Admin Dashboard
- Resume Version History
- Notification Center

---

# 🧪 Testing

The application has been tested for:

- Authentication
- Protected Routes
- Resume Upload
- AI Resume Parsing
- Job Matching
- Candidate Ranking
- Dashboard Analytics
- MongoDB Integration
- Responsive Design

---

# 🤝 Contributing

Contributions are welcome.

### Fork the repository

```bash
git fork
```

Create a feature branch.

```bash
git checkout -b feature/new-feature
```

Commit your changes.

```bash
git commit -m "feat: add awesome feature"
```

Push your branch.

```bash
git push origin feature/new-feature
```

Open a Pull Request.

---

# 📜 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this project.

---

# 🙌 Acknowledgements

Special thanks to the open-source community and the technologies that made this project possible.

- React
- Node.js
- Express.js
- MongoDB Atlas
- Google Gemini AI
- Tailwind CSS
- Zustand
- Recharts
- Framer Motion
- Render

---

# ⭐ Support

If you found this project useful,

please consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future development.

---

# 👨‍💻 Author

**Sudarshan Gupta**

B.Tech Computer Science (AI & ML)

JSS Academy of Technical Education, Noida

GitHub:
https://github.com/Sudarshan28

LinkedIn:
(Add your LinkedIn profile)

Email:
sidpro9435@gmail.com

---

<p align="center">

Made with ❤️ using React, Node.js, MongoDB & Gemini AI

⭐ If you like this project, don't forget to star the repository!

</p>
