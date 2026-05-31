import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Trash2, Users, Calendar, MapPin, Eye } from 'lucide-react';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recruiter/jobs');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const res = await api.delete(`/recruiter/job/${id}`);
      if (res.data.success) {
        toast.success('Job deleted successfully');
        fetchMyJobs();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete job posting.');
    }
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
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">MY JOB POSTINGS</h1>
              <p className="text-gray-500 font-body text-sm">Manage the active career pipelines launched from your company.</p>
            </div>
            
            <Link
              to="/recruiter/post-job"
              className="py-2.5 px-4 rounded text-white transition-all font-display font-bold text-xs hover:opacity-95 shadow-sm"
              style={{ backgroundColor: '#202A36' }}
            >
              POST A NEW JOB
            </Link>
          </div>

          {/* Job Feed */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-48 rounded-xl bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-12 text-center">
              <span className="text-xs font-mono text-gray-500 border border-gray-200 bg-gray-50 px-4 py-2 rounded">
                NO ACTIVE JOB POSTINGS
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map(job => (
                <div
                  key={job._id}
                  className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:border-[#202A36]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                          {job.type}
                        </span>
                        <h3 className="text-lg font-display font-bold text-gray-900 mt-2 line-clamp-1">
                          {job.title}
                        </h3>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 border-t border-gray-100 pt-4">
                    <Link
                      to={`/recruiter/applicants/${job._id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded text-white font-display font-bold text-sm shadow-sm hover:opacity-95 transition-all"
                      style={{ backgroundColor: '#202A36' }}
                    >
                      <Users className="w-4 h-4" />
                      <span>APPLICANTS ({job.applicants?.length || 0})</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyJobs;
