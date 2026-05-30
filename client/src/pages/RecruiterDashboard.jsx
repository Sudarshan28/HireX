import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import StatCard from '../components/StatCard';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  PlusCircle, 
  Trash2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({
    totalJobsPosted: 0,
    totalApplicants: 0,
    activeJobs: 0,
    hired: 0,
    recentJobs: [],
    topApplicants: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recruiter/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const res = await api.delete(`/recruiter/job/${id}`);
      if (res.data.success) {
        toast.success('Job deleted successfully');
        fetchDashboardStats();
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

      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">RECRUITER DASHBOARD</h1>
              <p className="text-gray-500 font-body text-sm">Monitor job channels, analyze applicant scores, and process pipelines.</p>
            </div>
            
            <div className="flex gap-3">
              <Link
                to="/recruiter/post-job"
                className="flex items-center gap-2 py-2.5 px-4 rounded text-white transition-all font-display font-bold text-xs hover:opacity-95 shadow-sm"
                style={{ backgroundColor: '#202A36' }}
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>POST NEW JOB</span>
              </Link>
              <Link
                to="/recruiter/talent-pool"
                className="flex items-center gap-2 py-2.5 px-4 rounded bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-all font-display font-bold text-xs shadow-sm"
              >
                <Users className="w-4 h-4 text-gray-500" />
                <span>TALENT POOL</span>
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Jobs Posted" value={stats.totalJobsPosted} icon={Briefcase} color="#202A36" />
            <StatCard title="Total Applicants" value={stats.totalApplicants} icon={Users} color="#3B82F6" />
            <StatCard title="Active Jobs" value={stats.activeJobs} icon={TrendingUp} color="#10B981" />
            <StatCard title="Hired" value={stats.hired} icon={CheckCircle} color="#10B981" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent jobs list */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 lg:col-span-2 overflow-x-auto">
              <h3 className="text-lg font-display font-bold text-gray-900 mb-6">RECENT JOB POSTINGS</h3>
              {stats.recentJobs.length === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-mono text-gray-500 border border-gray-200 bg-gray-50 px-4 py-2 rounded">
                    NO JOB RECORDS FOUND
                  </span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-mono text-xs uppercase">
                      <th className="pb-3 font-semibold">Title</th>
                      <th className="pb-3 font-semibold">Applicants</th>
                      <th className="pb-3 font-semibold">Posted Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentJobs.map((job) => (
                      <tr key={job.id} className="border-b border-gray-100 text-gray-900 hover:bg-gray-50/50">
                        <td className="py-3.5">
                          <Link to={`/recruiter/applicants/${job.id}`} className="font-display font-bold hover:text-emerald-600 transition-colors">
                            {job.title}
                          </Link>
                        </td>
                        <td className="py-3.5 text-gray-500 font-mono">{job.applicantsCount} candidates</td>
                        <td className="py-3.5 text-xs text-gray-500">{new Date(job.postedDate).toLocaleDateString()}</td>
                        <td className="py-3.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            job.status === 'Active' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1.5 hover:text-red-500 transition-colors text-gray-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Top applicants widget */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
              <h3 className="text-lg font-display font-bold text-gray-900 mb-6">TOP COMPATIBLE CANDIDATES</h3>
              {stats.topApplicants.length === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-mono text-gray-500 border border-gray-200 bg-gray-50 px-4 py-2 rounded">
                    NO ACTIVE CANDIDATE PIPELINES
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.topApplicants.map((app, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all flex items-center justify-between">
                      <div>
                        <h4 className="font-display font-bold text-sm text-gray-900 capitalize">
                          {app.student?.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{app.jobTitle}</p>
                        <span className="text-[10px] font-mono text-emerald-700 mt-1.5 inline-block">
                          {app.student?.university || 'Stanford University'}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                          {app.matchScore}%
                        </span>
                        <Link
                          to={`/recruiter/applicants/${app.jobId}`}
                          className="flex items-center gap-1 text-[10px] font-mono text-gray-500 hover:text-emerald-600 mt-3 uppercase"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
