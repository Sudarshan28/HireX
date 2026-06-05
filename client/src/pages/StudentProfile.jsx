import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ResumeUpload from '../components/ResumeUpload';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Save, Check } from 'lucide-react';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [skills, setSkills] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/student/profile');
        if (res.data.success) {
          const profile = res.data.data;
          setName(profile.name || '');
          setUniversity(profile.university || '');
          setGraduationYear(profile.graduationYear || '');
          setSkills(profile.skills || []);
          setResumeUrl(profile.resumeUrl || '');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to retrieve profile data.');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !university || !graduationYear) {
      toast.error('Please complete all standard profile fields.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put('/student/profile', {
        name,
        university,
        graduationYear: parseInt(graduationYear),
        skills
      });

      if (res.data.success) {
        updateUser(res.data.data);
        toast.success('Profile saved successfully');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSuccess = (data) => {
    setSkills(data.skills);
    setResumeUrl(data.resumeUrl);
    updateUser(data);
    toast.success('Resume parsed and skills calibrated successfully!');
  };

  const handleDeleteSuccess = (data) => {
    setResumeUrl('');
    setSkills(data.skills || []);
    updateUser(data);
    toast.success('Resume deleted and profile updated successfully!');
  };

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <TopNav />

      <main className="pl-0 md:pl-64 pt-16 min-h-screen">
        <div className="p-8 max-w-4xl space-y-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">STUDENT PROFILE</h1>
            <p className="text-gray-500 font-body text-sm">Calibrate your professional details and resume vectors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="md:col-span-2 bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-6">
              <h3 className="text-lg font-display font-bold text-gray-900 border-b border-gray-100 pb-4">
                Personal Credentials
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">University</label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Graduation Year</label>
                  <input
                    type="number"
                    required
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 transition-colors"
                  />
                </div>

                {/* Skill tagging input */}
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">
                    Skills Detected (Type and press Enter)
                  </label>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="e.g. Docker, Python..."
                    className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 transition-colors"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 text-xs font-mono bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded"
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

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 py-3 px-6 rounded text-white font-display font-bold text-sm transition-all shadow-sm"
                  style={{ backgroundColor: '#202A36' }}
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'SAVING VECTORS...' : 'SAVE PROFILE'}</span>
                </button>
              </form>
            </div>

            {/* Resume Upload Section */}
            <div className={`relative rounded-xl p-8 space-y-6 flex flex-col justify-between transition-all duration-300 ${
              !resumeUrl
                ? 'bg-white border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              {!resumeUrl && (
                <div className="absolute -top-3 right-4 bg-amber-500 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                  Required
                </div>
              )}
              {resumeUrl && (
                <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Active
                </div>
              )}
              <div>
                <h3 className="text-lg font-display font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">
                  Resume Vector
                </h3>
                <p className="text-xs text-gray-500 font-body mb-6 leading-relaxed">
                  Upload a PDF resume to allow the platform to auto-detect skills and generate vector-based job compatibility scores.
                </p>
                <ResumeUpload 
                  resumeUrl={resumeUrl}
                  onUploadSuccess={handleUploadSuccess} 
                  onDeleteSuccess={handleDeleteSuccess}
                />
              </div>

              {resumeUrl && (
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 p-3 rounded border border-emerald-100 shadow-sm">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Active PDF Resume Loaded</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;
