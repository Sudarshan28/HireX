<div align="center">

# 🚀 HireX

### Smart Recruitment System with AI Resume Matching

HireX is a full-stack MERN application that helps students discover relevant job opportunities and enables recruiters to identify the most suitable candidates using AI-assisted resume analysis and compatibility scoring.

<p align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google-Gemini-blue?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge)

</p>

<p align="center">

🌐 **Live Demo:** https://hirex-frontend-hhbv.onrender.com/

📂 **Repository:** https://github.com/Sudarshan28/HireX
</p>

</div>

---

# 📖 Overview

Recruitment platforms often rely on manual resume screening, making the hiring process slow and inefficient.

HireX simplifies this process by using AI to understand resumes, extract meaningful information, compare candidate profiles with job requirements, and recommend suitable opportunities.

The platform provides dedicated portals for both students and recruiters, helping reduce manual effort while improving recruitment efficiency.

---

# ✨ Features

## 👨‍🎓 Student Portal

- Secure Registration & Login
- JWT Authentication
- Resume Upload (PDF)
- AI Resume Parsing
- Automatic Skill Extraction
- AI Job Recommendations
- Compatibility Score
- AI Resume Insights
- One-click Job Application
- Application Tracking
- Dashboard Analytics
- Skill Visualization

---

## 👩‍💼 Recruiter Portal

- Secure Recruiter Authentication
- Create & Manage Job Listings
- View Applicants
- AI Candidate Ranking
- Candidate Compatibility Score
- Skill Gap Analysis
- Update Hiring Status
- Recruiter Dashboard
- Hiring Analytics

---

# 🧠 AI Resume Matching

HireX uses **Google Gemini AI** to analyse uploaded resumes and compare them with job requirements.

The AI pipeline performs:

- Resume understanding
- Skill extraction
- Experience extraction
- Education extraction
- Candidate profiling
- Job compatibility scoring
- Explainable AI insights

Instead of manually reviewing every resume, recruiters receive ranked applicants with compatibility scores, helping them identify suitable candidates more efficiently.

---

# 📸 Application Preview

> Replace these placeholder images with screenshots from your project.

## 🏠 Landing Page

```text
assets/screenshots/home.png
```

---

## 👨‍🎓 Student Dashboard

```text
assets/screenshots/student-dashboard.png
```

---

## 👩‍💼 Recruiter Dashboard

```text
assets/screenshots/recruiter-dashboard.png
```

---

## 📄 Resume Upload & AI Analysis

```text
assets/screenshots/resume-analysis.png
```

---

## 📊 Analytics Dashboard

```text
assets/screenshots/analytics.png
```

---

## 🥇 Applicant Ranking

```text
assets/screenshots/ranking.png
```

---

# 🏗 System Architecture

```text
                         React + Vite
                    (Student / Recruiter UI)
                              │
                              │ REST API
                              ▼
                   Node.js + Express Server
                              │
         ┌────────────────────┴────────────────────┐
         │                                         │
         ▼                                         ▼
 MongoDB Atlas                           Google Gemini AI
(User Data & Jobs)                  (Resume Intelligence)
```

---

# 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI | Google Gemini API |
| Authentication | JWT |
| State Management | Zustand |
| Charts | Recharts |
| Animation | Framer Motion |
| File Upload | Multer |
| Resume Parsing | pdf-parse |
| API Testing | Postman |
| Version Control | Git & GitHub |
| Deployment | Render |

---

# 📂 Project Structure

```text
HireX
│
├── client
│   ├── public
│   ├── src
│   │
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── store
│   ├── services
│   └── assets
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── config
│   └── utils
│
├── render.yaml
├── package.json
└── README.md
```

---

# ⭐ Highlights

- Full Stack MERN Project
- AI Resume Analysis
- Smart Job Matching
- Resume Upload System
- Recruiter Dashboard
- Interactive Analytics
- JWT Authentication
- MongoDB Atlas Integration
- Responsive User Interface
- Production Deployment

---

# 💡 Why HireX?

HireX focuses on making recruitment smarter by combining modern web technologies with AI-assisted resume analysis.

Students receive personalised job recommendations based on their resumes, while recruiters can quickly identify strong candidates using compatibility scores instead of manually reviewing every application.

The result is a faster, more organised, and data-driven recruitment experience for both sides.

---

# 🚀 Getting Started

Follow these steps to run HireX on your local machine.

---

## 📋 Prerequisites

Make sure the following software is installed:

- Node.js (v18 or later)
- npm
- Git
- MongoDB Atlas Account
- Google Gemini API Key

---

## 📥 Clone the Repository

```bash
git clone https://github.com/Sudarshan28/HireX.git

cd HireX
```

---

## 📦 Install Dependencies

Install all frontend and backend dependencies.

```bash
npm run install:all
```

---

# ⚙️ Environment Variables

Create the following environment files before running the application.

---

## Server (.env)

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

GEMINI_API_KEY=

CLIENT_URL=http://localhost:5173
```

---

## Client (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

# ▶️ Run the Project

Start both frontend and backend.

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

HireX uses **JSON Web Tokens (JWT)** for secure authentication.

### Features

- User Registration
- Secure Login
- Protected Routes
- Access Token Authentication
- Refresh Token Support
- Role-based Authorization

### Supported Roles

- 👨‍🎓 Student
- 👩‍💼 Recruiter

---

# 📄 Resume Processing Workflow

```text
Upload Resume (PDF)
        │
        ▼
Resume Parsing
(pdf-parse)
        │
        ▼
Google Gemini AI
        │
        ▼
Extract Skills
Extract Education
Extract Experience
        │
        ▼
Candidate Profile
        │
        ▼
AI Compatibility Score
        │
        ▼
Recommended Jobs
```

---

# 👩‍💼 Recruitment Workflow

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
AI Evaluates Applications
        │
        ▼
Compatibility Score
        │
        ▼
Candidate Ranking
        │
        ▼
Shortlist / Reject / Hire
```

---

# 📡 REST API

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh Access Token |
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

HireX is deployed using **Render**.

### Deployment Steps

1. Push the repository to GitHub.
2. Connect the repository to Render.
3. Configure all required environment variables.
4. Deploy the backend service.
5. Deploy the frontend.
6. Verify API connectivity.

---

# 📌 Future Improvements

The following enhancements are planned for future versions:

- Email Notifications
- Resume Feedback
- Improved Search & Filters
- Better Analytics
- Performance Optimisation
- Enhanced UI & Accessibility

---

# 🧪 Testing

The application has been manually tested for:

- Authentication
- Resume Upload
- AI Resume Parsing
- Job Applications
- Recruiter Dashboard
- Candidate Ranking
- API Endpoints (Postman)
- Responsive Layout

---

# 🤝 Contributing

Contributions are welcome.

1. Fork this repository.

2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "feat: add new feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

# 📜 License

This project is licensed under the MIT License.

---

# 🙏 Acknowledgements

This project was built using:

- React
- Vite
- Node.js
- Express.js
- MongoDB Atlas
- Google Gemini AI
- Tailwind CSS
- Zustand
- Recharts
- Framer Motion
- Multer
- pdf-parse
- Render
- Postman

A big thanks to the open-source community for the amazing tools and libraries.

---

# 👨‍💻 Author

**Sudarshan Gupta**

B.Tech Computer Science & Engineering (Artificial Intelligence & Machine Learning)

**JSS University, Noida**

📧 Email: sidpro9435@gmail.com

🐙 GitHub: https://github.com/Sudarshan28

💼 LinkedIn: https://www.linkedin.com/in/sudarshan-gupta-601b2b324/
---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a star!

Made with ❤️ by **Sudarshan Gupta**

</div>
