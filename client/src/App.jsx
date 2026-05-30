import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import StudentRegister from './pages/StudentRegister';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import FindJobs from './pages/FindJobs';

import RecruiterRegister from './pages/RecruiterRegister';
import RecruiterLogin from './pages/RecruiterLogin';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import Applicants from './pages/Applicants';
import TalentPool from './pages/TalentPool';
import Interviews from './pages/Interviews';
import Analytics from './pages/Analytics';
import Support from './pages/Support';

// Toast styling
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Student Auth */}
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />
          
          {/* Recruiter Auth */}
          <Route path="/recruiter/register" element={<RecruiterRegister />} />
          <Route path="/recruiter/login" element={<RecruiterLogin />} />

          {/* Student Protected Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute roleRequired="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute roleRequired="student">
                <StudentProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/jobs" 
            element={
              <ProtectedRoute roleRequired="student">
                <FindJobs />
              </ProtectedRoute>
            } 
          />

          {/* Recruiter Protected Routes */}
          <Route 
            path="/recruiter/dashboard" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/post-job" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <PostJob />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/my-jobs" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <MyJobs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/applicants/:id" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <Applicants />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/talent-pool" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <TalentPool />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/interviews" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <Interviews />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/analytics" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <Analytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
