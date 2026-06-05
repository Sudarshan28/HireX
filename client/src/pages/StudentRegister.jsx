import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const StudentRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !university || !graduationYear) {
      toast.error('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register/student', {
        name,
        email,
        password,
        university,
        graduationYear: parseInt(graduationYear)
      });
      if (res.data.success) {
        login(res.data.data, res.data.token);
        toast.success('Initialize Account Successful!');
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        toast.error(errors[0].message);
      } else {
        toast.error(err.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Left Mesh Panel */}
      <div className="hidden lg:flex w-1/2 bg-white border-r border-gray-200 relative overflow-hidden flex-col justify-center items-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 animate-pulse opacity-50" />
        <div className="relative z-10 text-center max-w-md">
          <div 
            className="w-16 h-16 rounded flex items-center justify-center font-display font-bold text-white text-3xl shadow-sm mx-auto mb-8"
            style={{ backgroundColor: '#202A36' }}
          >
            HX
          </div>
          <h2 className="text-3xl font-display font-bold mb-4 text-gray-900">Join HireX</h2>
          <p className="text-gray-800 font-body text-base font-medium">
            Create an account to get matched with roles tailored for your skill sets using vector matching.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl p-8 my-8">
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl font-display font-bold mb-2 text-gray-900">INITIALIZE CANDIDATE ACCOUNT</h1>
            <p className="text-gray-800 font-body text-sm font-medium">Register your profile to begin vector matching</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-900 font-bold uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-405 transition-colors placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-900 font-bold uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-405 transition-colors placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-900 font-bold uppercase mb-1">University</label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Stanford University"
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-405 transition-colors placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-900 font-bold uppercase mb-1">Graduation Year</label>
              <input
                type="number"
                required
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="2026"
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-405 transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-mono text-gray-900 font-bold uppercase mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-405 transition-colors placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-8 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label className="block text-xs font-mono text-gray-900 font-bold uppercase mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:border-gray-405 transition-colors placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded text-white font-display font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center shadow-sm"
              style={{ backgroundColor: '#202A36' }}
            >
              {loading ? (
                <div className="flex gap-1.5 items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : 'INITIALIZE ACCOUNT'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-800 font-body font-medium">
            Already have an account?{' '}
            <Link to="/student/login" className="font-bold text-gray-950 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
