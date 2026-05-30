import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, User, Briefcase, Upload, Shield, Zap, Target } from 'lucide-react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative overflow-x-hidden text-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-between">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay for premium high contrast light theme */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-0 pointer-events-none" />

        {/* Navigation Bar */}
        <nav className="relative max-w-7xl mx-auto w-full px-8 py-6 flex justify-between items-center z-10 bg-transparent">
          {/* Brand Logo */}
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">HireX</span>
            <span className="w-2 h-2 rounded-full bg-[#202A36]"></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-semibold">
            <a href="#candidate-flow" className="text-gray-900 hover:text-gray-700 transition-colors text-sm">Candidate Flow</a>
            <a href="#recruiter-flow" className="text-gray-900 hover:text-gray-700 transition-colors text-sm">Recruiter Flow</a>
            <a href="#platform-features" className="text-gray-900 hover:text-gray-700 transition-colors text-sm">Features</a>
          </div>

          {/* Access Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/student/login" 
              className="flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-gray-700 transition-colors bg-white/80 hover:bg-white backdrop-blur-sm px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Candidate Portal</span>
            </Link>
            <Link 
              to="/recruiter/login" 
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#202A36] hover:bg-[#1a2229] transition-all px-4 py-2.5 rounded-lg shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiter Portal</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-900 hover:bg-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-24 left-8 right-8 bg-white border border-gray-200 rounded-xl shadow-xl p-6 z-20 flex flex-col gap-4 animate-fadeIn md:hidden">
            <a href="#candidate-flow" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 hover:text-gray-700 transition-colors font-bold text-sm">Candidate Flow</a>
            <a href="#recruiter-flow" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 hover:text-gray-700 transition-colors font-bold text-sm">Recruiter Flow</a>
            <a href="#platform-features" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 hover:text-gray-700 transition-colors font-bold text-sm">Features</a>
            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
              <Link
                to="/student/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-gray-300 bg-white/80 hover:bg-white text-gray-900 font-bold text-sm flex items-center justify-center gap-1.5"
              >
                <User className="w-4 h-4" />
                Candidate Portal
              </Link>
              <Link
                to="/recruiter/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-[#202A36] hover:bg-[#1a2229] text-white font-bold text-sm flex items-center justify-center gap-1.5"
              >
                <Briefcase className="w-4 h-4" />
                Recruiter Portal
              </Link>
            </div>
          </div>
        )}

        {/* Main Hero Content Area */}
        <div className="relative flex-1 flex items-center justify-center z-10 py-16">
          <div className="text-center max-w-4xl px-6 space-y-6">
            {/* Upper small label */}
            <span className="inline-block text-xs md:text-sm font-bold text-gray-800 uppercase tracking-widest bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-300 shadow-sm mb-2">
              HIREX AI PLATFORM
            </span>

            {/* Headline */}
            <div className="flex flex-col select-none">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-none tracking-tight">
                Vector-Calibrated
              </h1>
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
                style={{ color: '#202A36' }}
              >
                Job Matching.
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-gray-800 max-w-xl mx-auto leading-relaxed pt-2 font-medium">
              Upload your resume as a candidate to instantly parse and match compatibility, or launch optimized job channels as a recruiter with direct database tracking.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link to="/student/login">
                <button 
                  className="w-48 px-6 py-3 rounded-lg text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#202A36' }}
                >
                  <User className="w-4 h-4" />
                  <span>Candidate Workspace</span>
                </button>
              </Link>
              <Link to="/recruiter/login">
                <button className="w-48 px-6 py-3 rounded-lg bg-white border border-gray-300 hover:border-gray-400 text-gray-900 font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#202A36]" />
                  <span>Recruiter Workspace</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 flex justify-center pb-8">
          <a href="#candidate-flow" className="flex flex-col items-center text-xs font-bold text-gray-800 hover:text-gray-900 transition-colors">
            <span>EXPLORE WORKFLOWS</span>
            <div className="w-1 h-8 bg-gray-300 rounded-full mt-2 overflow-hidden relative">
              <div className="w-full h-1/2 bg-[#202A36] rounded-full animate-bounce absolute top-0" />
            </div>
          </a>
        </div>
      </section>

      {/* Candidate Workflow / Flowchart Section */}
      <section id="candidate-flow" className="relative py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#202A36] uppercase tracking-widest bg-gray-100 px-3 py-1 rounded">CANDIDATE TRACK</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4">Candidate Application Workflow</h2>
            <p className="text-gray-800 mt-2 font-medium">Follow this sequence to analyze, calibrate, and lock in career openings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-[#202A36] font-bold text-lg mb-4 border border-gray-200">
                01
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Create Account</h3>
              <p className="text-sm text-gray-800 font-medium">
                Register securely as a candidate and set up your dashboard credentials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-[#202A36] font-bold text-lg mb-4 border border-gray-200">
                02
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Resume PDF Parsing</h3>
              <p className="text-sm text-gray-800 font-medium">
                Upload your PDF resume to extract text dynamically via PyMuPDF parsing engines.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-[#202A36] font-bold text-lg mb-4 border border-gray-200">
                03
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Vector Match</h3>
              <p className="text-sm text-gray-800 font-medium">
                Generate similarity percentages with live jobs using MiniLM-L6 vector embeddings.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-[#202A36] font-bold text-lg mb-4 border border-gray-200">
                04
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pipeline Tracking</h3>
              <p className="text-sm text-gray-800 font-medium">
                Manage applications, schedule real interviews, and view direct compatibility feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Workflow / Flowchart Section */}
      <section id="recruiter-flow" className="relative py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#202A36] uppercase tracking-widest bg-gray-200 px-3 py-1.5 rounded">RECRUITER TRACK</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4">Recruiter Acquisition Workflow</h2>
            <p className="text-gray-800 mt-2 font-medium">Structure openings, parse incoming resumes, and calibrate matching pipelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-[#202A36] font-bold text-lg mb-4 border border-gray-200">
                01
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Initialize Profile</h3>
              <p className="text-sm text-gray-800 font-medium">
                Register as a recruiter to post live jobs and manage candidate review stages.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-[#202A36] font-bold text-lg mb-4 border border-gray-200">
                02
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Publish Job Channels</h3>
              <p className="text-sm text-gray-800 font-medium">
                Describe positions with key requirements, specific skills keywords, and metadata.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-[#202A36] font-bold text-lg mb-4 border border-gray-200">
                03
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rank Compatibility</h3>
              <p className="text-sm text-gray-800 font-medium">
                Query candidate vectors dynamically and rank applicants by AI compatibility.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-[#202A36] font-bold text-lg mb-4 border border-gray-200">
                04
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hiring Funnel</h3>
              <p className="text-sm text-gray-800 font-medium">
                Advance candidates through pipeline stages (Interviewing, Hired) with real database sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="platform-features" className="relative py-24 bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#202A36] uppercase tracking-widest bg-gray-100 px-3 py-1 rounded">TECHNOLOGY FEATURES</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4">Engineered for Premium Calibration</h2>
            <p className="text-gray-800 mt-2 font-medium">Advanced vector math matching candidates and jobs without clutter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
              <Target className="w-8 h-8 text-[#202A36] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">MiniLM-L6 Embeddings</h3>
              <p className="text-sm text-gray-800 font-medium">
                High-precision sentence-transformer vector similarities matching parsed resume text against descriptions.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
              <Shield className="w-8 h-8 text-[#202A36] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Authentication</h3>
              <p className="text-sm text-gray-800 font-medium">
                JWT-protected route boundaries separating candidate profiles and recruiter admin channels.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
              <Zap className="w-8 h-8 text-[#202A36] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real MongoDB Telemetry</h3>
              <p className="text-sm text-gray-800 font-medium">
                Zero mock database counts. All statistics are aggregated directly from Atlas document records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#202A36] text-white py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight">HireX</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; 2026 HireX Recruitment Systems. All rights reserved. Premium AI Candidate Calibrator.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
