import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Full-time');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location || !deadline) {
      toast.error('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/recruiter/post-job', {
        title,
        type,
        location,
        description,
        skills,
        applyUrl,
        deadline
      });

      if (res.data.success) {
        toast.success('Job posted successfully');
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to publish job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <TopNav />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 max-w-3xl space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">POST A JOB</h1>
              <p className="text-gray-500 font-body text-sm">Create a new career opening channel with custom calibration.</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-[#202A36] transition-colors hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Job Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-[#202A36] transition-colors hover:border-gray-300"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India (Hybrid)"
                    className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-[#202A36] transition-colors hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-[#202A36] transition-colors hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Skills Tags input */}
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">
                  Skills Required (Type and press Enter)
                </label>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="e.g. React, Node.js, AWS..."
                  className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-[#202A36] transition-colors hover:border-gray-300"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 text-xs font-mono bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-500 font-bold focus:outline-none text-[10px]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">External Apply URL (Optional)</label>
                <input
                  type="url"
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  placeholder="https://company.com/careers/job-apply"
                  className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-[#202A36] transition-colors hover:border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Job Description *</label>
                <textarea
                  required
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the roles, responsibilities, salary range, and candidate expectations..."
                  className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm text-gray-900 focus:border-[#202A36] transition-colors hover:border-gray-300 font-body"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 rounded bg-[#202A36] hover:bg-opacity-90 text-white font-display font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>POST JOB</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostJob;
