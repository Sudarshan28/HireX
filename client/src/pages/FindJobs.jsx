import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import JobCard from '../components/JobCard';
import Drawer from '../components/common/Drawer';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Search, SlidersHorizontal, RefreshCw, ExternalLink, Briefcase, GraduationCap, Gift, ChevronDown, Globe } from 'lucide-react';

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openSection, setOpenSection] = useState('qualifications');

  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? null : section);
  };
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [opportunityType, setOpportunityType] = useState('all');
  const [sortByMatch, setSortByMatch] = useState('true');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Fetch applied jobs first
      const appliedRes = await api.get('/student/applied-jobs');
      if (appliedRes.data.success) {
        setAppliedJobs(appliedRes.data.data.map(j => j._id));
      }

      // Fetch matched jobs
      const res = await api.get('/student/jobs', {
        params: {
          search: searchTerm,
          location: locationFilter,
          type: typeFilter,
          opportunityType,
          sortByMatch
        }
      });
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load jobs feed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncJSearch = async () => {
    try {
      setSyncing(true);
      toast.info('Initiating JSearch external fetching stream...');
      const res = await api.get('/jobs/fetch-external', {
        params: { query: searchTerm || 'Software Engineer India' }
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to pull external jobs.');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, locationFilter, typeFilter, opportunityType, sortByMatch]);

  const handleApply = async (jobId) => {
    try {
      const res = await api.post(`/student/apply/${jobId}`);
      if (res.data.success) {
        toast.success('Initialize Application Successful!');
        setAppliedJobs([...appliedJobs, jobId]);
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit application.');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setTypeFilter('');
    setOpportunityType('all');
    setSortByMatch('true');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar />
      <TopNav />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">FIND OPPORTUNITIES</h1>
              <p className="text-gray-500 font-body text-sm">Browse openings and view AI vector-based matching scores.</p>
            </div>
            
            <button
              onClick={handleSyncJSearch}
              disabled={syncing}
              className="flex items-center gap-2 py-2.5 px-4 rounded text-white transition-all font-display font-bold text-xs shadow-sm hover:opacity-95"
              style={{ backgroundColor: '#202A36' }}
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'FETCHING CHANNELS...' : 'PULL JSEARCH EXTERNAL JOBS'}</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter sidebar */}
            <aside className="w-full lg:w-80 bg-white border border-gray-200 shadow-sm rounded-xl p-6 h-fit space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 text-sm font-display font-bold text-gray-900 border-b border-gray-100 pb-4">
                <SlidersHorizontal className="w-4 h-4 text-gray-700" />
                <span>FILTER & CALIBRATE</span>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Search Query</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Keywords, role, or company..."
                    className="w-full bg-gray-50 border border-gray-300 rounded pl-10 pr-4 py-2 text-xs text-gray-900 focus:border-gray-400 transition-colors"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Location</label>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="e.g. Remote, India, San Francisco..."
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:border-gray-400 transition-colors"
                />
              </div>

              {/* Job type dropdown */}
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Work Mode</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:border-gray-400 transition-colors"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* Match Sorting toggle */}
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Sort Criteria</label>
                <div className="flex gap-2 bg-gray-50 rounded p-1 border border-gray-300">
                  <button
                    onClick={() => setSortByMatch('true')}
                    className={`flex-1 py-1.5 text-[10px] font-mono rounded transition-all ${
                      sortByMatch === 'true' 
                        ? 'bg-[#202A36] text-white font-bold shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    AI MATCH %
                  </button>
                  <button
                    onClick={() => setSortByMatch('false')}
                    className={`flex-1 py-1.5 text-[10px] font-mono rounded transition-all ${
                      sortByMatch === 'false' 
                        ? 'bg-[#202A36] text-white font-bold shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    RECENT POSTS
                  </button>
                </div>
              </div>

              <button
                onClick={handleResetFilters}
                className="w-full py-2 bg-transparent border border-gray-300 hover:border-red-500 text-gray-500 hover:text-red-500 rounded text-xs font-mono transition-all uppercase"
              >
                Reset Filters
              </button>
            </aside>

            {/* Jobs feed */}
            <div className="flex-1 space-y-6">
              {/* High-level category switcher */}
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setOpportunityType('all')}
                  className={`py-3 px-6 text-sm font-display font-bold border-b-2 transition-all duration-200 ${
                    opportunityType === 'all'
                      ? 'border-[#202A36] text-[#202A36]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  All Opportunities
                </button>
                <button
                  type="button"
                  onClick={() => setOpportunityType('job')}
                  className={`py-3 px-6 text-sm font-display font-bold border-b-2 transition-all duration-200 ${
                    opportunityType === 'job'
                      ? 'border-[#202A36] text-[#202A36]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Jobs Only
                </button>
                <button
                  type="button"
                  onClick={() => setOpportunityType('internship')}
                  className={`py-3 px-6 text-sm font-display font-bold border-b-2 transition-all duration-200 ${
                    opportunityType === 'internship'
                      ? 'border-[#202A36] text-[#202A36]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Internships Only
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-64 rounded-xl bg-white border border-gray-200 animate-pulse shadow-sm" />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-12 text-center">
                  <span className="text-xs font-mono text-gray-500 border border-gray-200 bg-gray-50 px-4 py-2 rounded">
                    NO ACTIVE OPPORTUNITY STREAMS MATCHING FILTER
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map(job => (
                    <JobCard
                      key={job._id}
                      job={job}
                      isApplied={appliedJobs.includes(job._id)}
                      onApply={handleApply}
                      onViewDetails={setSelectedJob}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Drawer
        isOpen={!!selectedJob}
        onClose={() => { setSelectedJob(null); setOpenSection('qualifications'); }}
        title="Job Details"
      >
        {selectedJob && (
          <div className="space-y-6 pb-20">
            {/* Header / Title */}
            <div className="flex gap-4 items-start border-b border-gray-100 pb-5">
              {selectedJob.employerLogo ? (
                <img 
                  src={selectedJob.employerLogo} 
                  alt={selectedJob.company} 
                  className="w-16 h-16 rounded-xl border border-gray-200 object-contain p-1.5 bg-white shadow-sm flex-shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center font-display font-bold text-gray-700 shadow-sm flex-shrink-0 text-xl">
                  {selectedJob.company?.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-gray-700 uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-200 font-semibold">
                    {selectedJob.type || 'Full-time'}
                  </span>
                  {selectedJob.publisher && (
                    <span className="text-[10px] font-mono text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-semibold">
                      Via {selectedJob.publisher}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 leading-tight">
                  {selectedJob.title}
                </h3>
                <p className="text-sm font-semibold text-gray-600 font-body mt-0.5">{selectedJob.company}</p>
              </div>
            </div>

            {/* AI Match Gauge */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col items-center">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="transition-all duration-1000 ease-out"
                      strokeWidth="3.5"
                      strokeDasharray={`${selectedJob.matchScore || 0}, 100`}
                      strokeLinecap="round"
                      stroke={(selectedJob.matchScore || 0) >= 70 ? '#10B981' : (selectedJob.matchScore || 0) >= 50 ? '#F59E0B' : '#EF4444'}
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-gray-700">
                    {selectedJob.matchScore || 0}%
                  </div>
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-sm">AI Selection Percentage</h4>
                  <p className="text-xs text-gray-500 font-body mt-0.5">
                    {selectedJob.matchScore >= 70 
                      ? "You are a strong fit for this opportunity based on resume alignment." 
                      : selectedJob.matchScore >= 50 
                        ? "You have moderate alignment with the job requirements." 
                        : "Your resume details show limited match alignment with this opening."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm">
                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Salary</span>
                <span className="text-xs font-bold text-gray-900">{selectedJob.salary || 'Competitive'}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm">
                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Location</span>
                <span className="text-xs font-bold text-gray-900">{selectedJob.location || 'Remote'}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm">
                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Work Mode</span>
                <span className="text-xs font-bold text-gray-900">{selectedJob.isRemote ? 'Remote / WFH' : 'On-site'}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm">
                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Platform</span>
                <span className="text-xs font-bold text-gray-900 truncate block">{selectedJob.publisher || 'Direct Board'}</span>
              </div>
            </div>

            {/* Skills required */}
            {selectedJob.skills && selectedJob.skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-gray-500 uppercase">Skills Required</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="text-xs font-mono bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Details Accordions */}
            <div className="space-y-3">
              {/* Qualifications Accordion */}
              {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => toggleSection('qualifications')}
                    className="w-full flex items-center justify-between p-4 font-display font-bold text-sm text-gray-800 bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center gap-2"><GraduationCap size={16} className="text-gray-600" /> Qualifications & Skills</span>
                    <ChevronDown size={16} className={`transform transition-transform ${openSection === 'qualifications' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'qualifications' && (
                    <div className="p-4 border-t border-gray-200 bg-white space-y-2.5">
                      {selectedJob.qualifications.map((q, i) => (
                        <div key={i} className="flex gap-2 text-xs text-gray-700 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Responsibilities Accordion */}
              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => toggleSection('responsibilities')}
                    className="w-full flex items-center justify-between p-4 font-display font-bold text-sm text-gray-800 bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center gap-2"><Briefcase size={16} className="text-gray-600" /> Key Responsibilities</span>
                    <ChevronDown size={16} className={`transform transition-transform ${openSection === 'responsibilities' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'responsibilities' && (
                    <div className="p-4 border-t border-gray-200 bg-white space-y-2.5">
                      {selectedJob.responsibilities.map((r, i) => (
                        <div key={i} className="flex gap-2 text-xs text-gray-700 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Benefits Accordion */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => toggleSection('benefits')}
                    className="w-full flex items-center justify-between p-4 font-display font-bold text-sm text-gray-800 bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center gap-2"><Gift size={16} className="text-gray-600" /> Benefits & Perks</span>
                    <ChevronDown size={16} className={`transform transition-transform ${openSection === 'benefits' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'benefits' && (
                    <div className="p-4 border-t border-gray-200 bg-white space-y-2.5">
                      {selectedJob.benefits.map((b, i) => (
                        <div key={i} className="flex gap-2 text-xs text-gray-700 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0"></span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Full Job Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-gray-500 uppercase">Full Description</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                {selectedJob.description}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 pt-4">
              {selectedJob.source === 'jsearch' ? (
                <a
                  href={selectedJob.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded text-white font-display font-bold text-sm shadow-sm transition-all hover:opacity-95"
                  style={{ backgroundColor: '#202A36' }}
                >
                  <span>APPLY</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button
                  onClick={() => {
                    handleApply(selectedJob._id);
                    setSelectedJob(null);
                  }}
                  disabled={appliedJobs.includes(selectedJob._id)}
                  className={`w-full py-3 px-4 rounded transition-all font-display font-bold text-sm border ${
                    appliedJobs.includes(selectedJob._id)
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'text-white shadow-sm hover:opacity-95'
                  }`}
                  style={!appliedJobs.includes(selectedJob._id) ? { backgroundColor: '#202A36', borderColor: '#202A36' } : {}}
                >
                  {appliedJobs.includes(selectedJob._id) ? 'APPLICATION SUBMITTED' : 'INITIALIZE APPLICATION'}
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default FindJobs;
