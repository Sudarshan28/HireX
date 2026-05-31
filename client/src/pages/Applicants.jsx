import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ApplicantDrawer from '../components/recruiter/ApplicantDrawer';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ArrowLeft, Download, FileText, Mail, Calendar, User } from 'lucide-react';

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      
      const jobRes = await api.get(`/jobs/${id}`);
      if (jobRes.data.success) {
        setJob(jobRes.data.data);
      }

      const res = await api.get(`/recruiter/applicants/${id}`);
      if (res.data.success) {
        setApplicants(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load applicant list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const res = await api.put('/recruiter/applicant-status', {
        jobId: id,
        studentId,
        status: newStatus
      });

      if (res.data.success) {
        toast.success(`Applicant status updated to ${newStatus}`);
        fetchApplicants();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-700 border-emerald-100 bg-emerald-50';
    if (score >= 70) return 'text-green-700 border-green-100 bg-green-50';
    if (score >= 50) return 'text-amber-700 border-amber-100 bg-amber-50';
    return 'text-red-700 border-red-100 bg-red-50';
  };

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

  const handleCardClick = (e, applicant) => {
    // If clicked on buttons or select, do not open details drawer
    if (e.target.closest('select') || e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    setSelectedApplicant(applicant);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <TopNav />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/recruiter/dashboard')}
              className="p-2 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 capitalize mb-1">
                {job?.title || 'Job Applicants'}
              </h1>
              <p className="text-gray-500 font-body text-sm">
                Analyze and shortlist candidates sorted by AI vector similarity.
              </p>
            </div>
          </div>

          {/* Grid list of applicants */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-64 rounded-xl bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : applicants.length === 0 ? (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-12 text-center">
              <span className="text-xs font-mono text-gray-500 border border-gray-200 bg-gray-50 px-4 py-2 rounded">
                NO APPLICATIONS YET
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicants.map((candidate, i) => {
                const sName = candidate.student?.name || 'Candidate';
                const sEmail = candidate.student?.email || 'Email not specified';
                const sUni = candidate.student?.university || 'Stanford University';
                const sSkills = candidate.student?.skills || [];
                const sResumeUrl = candidate.student?.resumeUrl;

                return (
                  <div
                    key={i}
                    onClick={(e) => handleCardClick(e, candidate)}
                    className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between cursor-pointer hover:border-gray-400 transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-display font-bold text-gray-900 capitalize">
                            {sName}
                          </h3>
                          <span className="text-xs font-mono text-gray-500 block mt-1">
                            {sUni}
                          </span>
                        </div>
                        
                        <div className={`font-mono text-sm font-bold border px-2.5 py-1 rounded-lg ${getScoreColor(candidate.matchScore)}`}>
                          {candidate.matchScore}% FIT
                        </div>
                      </div>

                      <div className="space-y-2.5 mb-6 text-xs text-gray-500 font-body">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{sEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Applied on: {new Date(candidate.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {sSkills && sSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-5">
                          {sSkills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="text-[10px] font-mono bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                          {sSkills.length > 3 && (
                            <span className="text-[10px] font-mono text-emerald-600">
                              +{sSkills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="space-y-3 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-gray-500 uppercase">Application Status</span>
                          <select
                            value={candidate.status}
                            onChange={(e) => handleStatusChange(candidate.student?._id || candidate.student, e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-900 focus:border-gray-400 transition-colors"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Hired">Hired</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <button
                            onClick={() => setSelectedApplicant(candidate)}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded border border-gray-300 hover:border-gray-400 text-gray-700 transition-all font-display font-bold text-[10px] shadow-sm bg-white"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>VIEW DETAILS</span>
                          </button>
                          
                          {sResumeUrl ? (
                            <a
                              href={getFullResumeUrl(sResumeUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-700 transition-all font-display font-bold text-[10px] shadow-sm text-center"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>RESUME PDF</span>
                            </a>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-red-50 border border-red-100 text-red-500 font-mono text-[10px]">
                              <FileText className="w-3.5 h-3.5" />
                              <span>NO RESUME</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <ApplicantDrawer
        isOpen={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        applicant={selectedApplicant}
        job={job}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Applicants;
