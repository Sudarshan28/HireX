import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const RecruiterLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login/recruiter', { email, password });
      if (res.data.success) {
        login(res.data.data, res.data.token);
        toast.success('Initialize Session Successful!');
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Login failed.');
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
          <h2 className="text-3xl font-display font-bold mb-4 text-gray-900">Recruiter Portal</h2>
          <p className="text-gray-800 font-body text-base font-medium">
            Publish openings, leverage AI vector matching, and shortlist top-tier candidates in minutes.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl p-8">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-display font-bold mb-2 text-gray-900">INITIALIZE RECRUITER SESSION</h1>
            <p className="text-gray-800 font-body text-sm font-medium">Enter your credentials to manage candidates</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-gray-900 font-bold uppercase mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-3 text-sm text-gray-900 focus:border-gray-405 transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-mono text-gray-900 font-bold uppercase mb-2">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-3 text-sm text-gray-900 focus:border-gray-405 transition-colors placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded text-white font-display font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center shadow-sm"
              style={{ backgroundColor: '#202A36' }}
            >
              {loading ? (
                <div className="flex gap-1.5 items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : 'INITIALIZE SESSION'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-800 font-body font-medium">
            New recruiter?{' '}
            <Link to="/recruiter/register" className="font-bold text-gray-950 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterLogin;
