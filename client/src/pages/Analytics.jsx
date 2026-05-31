import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import api from '../api/axios';
import { toast } from 'react-toastify';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ShieldCheck, Info } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    avgTimeToHire: '0 days',
    interviewRate: '0%',
    deiScore: 'N/A',
    lineData: [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 0 },
      { name: 'Mar', value: 0 },
      { name: 'Apr', value: 0 },
      { name: 'May', value: 0 },
      { name: 'Jun', value: 0 }
    ],
    pieData: [
      { name: 'LinkedIn', value: 0 },
      { name: 'Referrals', value: 0 },
      { name: 'Direct', value: 0 }
    ]
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recruiter/analytics');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load recruitment metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <TopNav />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">REAL-TIME INTELLIGENCE</h1>
              <p className="text-gray-500 font-body text-sm">Monitor hiring pipeline performance metrics and DEI diversity indicators.</p>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              DATA FEED INGESTION LIVE
            </span>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
              <span className="text-xs font-mono text-gray-500 uppercase">Total Applications</span>
              <h3 className="text-3xl font-display font-bold text-gray-900 mt-4">{stats.totalApplications}</h3>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
              <span className="text-xs font-mono text-gray-500 uppercase">Avg Time-to-Hire</span>
              <h3 className="text-3xl font-display font-bold text-gray-900 mt-4">{stats.avgTimeToHire}</h3>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
              <span className="text-xs font-mono text-gray-500 uppercase">Interview Rate</span>
              <h3 className="text-3xl font-display font-bold text-gray-900 mt-4">{stats.interviewRate}</h3>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
              <span className="text-xs font-mono text-gray-500 uppercase">DEI Score</span>
              <h3 className="text-3xl font-display font-bold text-gray-900 mt-4">{stats.deiScore}</h3>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 w-full">
            <h3 className="text-lg font-display font-bold text-gray-900 mb-6">HIRING FUNNEL EFFICIENCY</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.lineData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#111827' }} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#202A36" 
                    strokeWidth={3} 
                    dot={{ fill: '#202A36', r: 5 }} 
                    activeDot={{ r: 8 }} 
                    label={{ fill: '#111827', fontSize: 12, fontWeight: 'bold', position: 'top', offset: 10 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
