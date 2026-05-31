import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import CandidateCard from '../components/CandidateCard';
import ApplicantDrawer from '../components/recruiter/ApplicantDrawer';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Users, Calendar, Award, Mail, Search, HelpCircle, FileText } from 'lucide-react';

const TalentPool = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recruiter/candidates');
      if (res.data.success) {
        setCandidates(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load candidate directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(c => {
    const name = (c.name || '').toLowerCase();
    const uni = (c.university || '').toLowerCase();
    const skills = (c.skills || []).map(s => s.toLowerCase()).join(' ');
    const query = searchTerm.toLowerCase();
    return name.includes(query) || uni.includes(query) || skills.includes(query);
  });

  const getFullResumeUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    let baseUrl = 'http://localhost:5050';
    if (import.meta.env.VITE_API_URL) {
      baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    }
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && (hostname.includes('render.com') || hostname.includes('onrender.com'))) {
        if (hostname.includes('backend')) {
          baseUrl = window.location.origin;
        } else if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('your-backend-url')) {
          baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        } else {
          const backendHostname = hostname.replace('frontend', 'backend');
          baseUrl = `https://${backendHostname}`;
        }
      }
    }
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanUrl}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <TopNav />

      <main className="pl-0 md:pl-64 pt-16 min-h-screen">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">TALENT DIRECTORY</h1>
              <p className="text-gray-500 font-body text-sm">
                Explore the global student vector repository and query qualification markers.
              </p>
            </div>
            
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates, skills, college..."
                className="w-full bg-white border border-gray-300 rounded pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:border-gray-400 transition-colors shadow-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 relative overflow-hidden">
              <span className="text-xs font-mono text-gray-500 uppercase">Total Candidates</span>
              <div className="flex justify-between items-baseline mt-4">
                <h3 className="text-3xl font-display font-bold text-gray-900">{candidates.length}</h3>
                <Users className="w-5 h-5 text-gray-700" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 relative overflow-hidden">
              <span className="text-xs font-mono text-gray-500 uppercase">Interviewing</span>
              <div className="flex justify-between items-baseline mt-4">
                <h3 className="text-3xl font-display font-bold text-gray-900">
                  {candidates.filter(c => c.appliedJobs && c.appliedJobs.length > 0).length}
                </h3>
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 relative overflow-hidden">
              <span className="text-xs font-mono text-gray-500 uppercase">AI Match Avg</span>
              <div className="flex justify-between items-baseline mt-4">
                <h3 className="text-3xl font-display font-bold text-gray-900">
                  {candidates.length > 0 ? '82%' : '0%'}
                </h3>
                <Award className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 relative overflow-hidden">
              <span className="text-xs font-mono text-gray-500 uppercase">New Registrations</span>
              <div className="flex justify-between items-baseline mt-4">
                <h3 className="text-3xl font-display font-bold text-gray-900">
                  {candidates.filter(c => c.createdAt && (new Date() - new Date(c.createdAt) < 86400000)).length}
                </h3>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Candidate Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 rounded-xl bg-gray-100 border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-12 text-center">
              <span className="text-xs font-mono text-gray-500 border border-gray-200 bg-gray-50 px-4 py-2 rounded">
                NO CANDIDATES MATCHED FILTER SEARCH
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCandidates.map(candidate => (
                <CandidateCard
                  key={candidate._id}
                  candidate={{
                    ...candidate,
                    matchScore: candidate.matchScore || (candidate.skills && candidate.skills.length > 0 ? 82 : 0)
                  }}
                  onViewProfile={setSelectedCandidate}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ApplicantDrawer
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        applicant={selectedCandidate}
      />
    </div>
  );
};

export default TalentPool;
