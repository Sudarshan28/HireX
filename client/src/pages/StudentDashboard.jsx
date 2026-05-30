import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { FileText, Award, XCircle, CheckCircle, Clock, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import StatCard from '../components/StatCard';
import api from '../api/axios';

const StudentDashboard = () => {
  const [data, setData] = useState({
    totalApplied: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
    interviews: 0,
    pending: 0,
    topMatchScore: 0,
    avgMatchScore: 0,
    applicationsByDay: [],
    statusBreakdown: { applied: 0, shortlisted: 0, rejected: 0, hired: 0 }
  });
  
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  window.updateUIViaAPI = (newData) => {
    console.log('UI updated via API injection:', newData);
    setData(prev => ({ ...prev, ...newData }));
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get('/student/dashboard/stats');
      if (statsRes.data.success) {
        window.updateUIViaAPI(statsRes.data.data);
      }

      // Fetch recent applications
      const appsRes = await api.get('/student/applied-jobs');
      if (appsRes.data.success) {
        setRecentApplications(appsRes.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pieData = [
    { name: 'Pending', value: data.pending || 0 },
    { name: 'Shortlisted', value: data.shortlisted || 0 },
    { name: 'Rejected', value: data.rejected || 0 },
    { name: 'Hired', value: data.hired || 0 },
  ];

  const PIE_COLORS = ['#3B82F6', '#10B981', '#EF4444', '#202A36'];

  // Skill coverage mapping
  const skillCoverage = [
    { subject: 'Frontend', A: 90, fullMark: 100 },
    { subject: 'Backend', A: 85, fullMark: 100 },
    { subject: 'UI/UX', A: 70, fullMark: 100 },
    { subject: 'DevOps', A: 60, fullMark: 100 },
    { subject: 'QA', A: 75, fullMark: 100 },
    { subject: 'Soft Skills', A: 80, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <TopNav />
      
      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">CANDIDATE DASHBOARD</h1>
            <p className="text-gray-500 font-body text-sm">Real-time vector matching & application intelligence pipeline.</p>
          </div>

          {/* 6 Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard title="Total Applied" value={data.totalApplied} icon={FileText} color="#202A36" dataStat="total-applied" />
            <StatCard title="Shortlisted" value={data.shortlisted} icon={Award} color="#10B981" dataStat="shortlisted" />
            <StatCard title="Rejected" value={data.rejected} icon={XCircle} color="#EF4444" dataStat="rejected" />
            <StatCard title="Hired" value={data.hired} icon={CheckCircle} color="#202A36" dataStat="hired" />
            <StatCard title="Interviews" value={data.interviews} icon={Calendar} color="#10B981" dataStat="interviews" />
            <StatCard title="Pending" value={data.pending} icon={Clock} color="#3B82F6" dataStat="pending" />
          </div>

          {/* Charts Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line/Area Chart */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 lg:col-span-2">
              <h3 className="text-lg font-display font-bold text-gray-900 mb-6">APPLICATIONS OVER TIME</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.applicationsByDay.length > 0 ? data.applicationsByDay : [{ date: 'Mon', count: 0 }, { date: 'Tue', count: 0 }]}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#202A36" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#202A36" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#111827' }} />
                    <Area type="monotone" dataKey="count" stroke="#202A36" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart (Application Status) */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
              <h3 className="text-lg font-display font-bold text-gray-900 mb-6">APPLICATION STATUS</h3>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#111827' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-display font-bold text-gray-900">{data.totalApplied}</span>
                  <span className="text-xs font-mono text-gray-500">TOTAL</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2 text-[10px] font-mono">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}></span>
                    <span className="text-gray-500 uppercase">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Coverage & Recent Applications Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skill coverage Radar */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
              <h3 className="text-lg font-display font-bold text-gray-900 mb-6">SKILL COVERAGE</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillCoverage}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Coverage" dataKey="A" stroke="#202A36" fill="#202A36" fillOpacity={0.15} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#111827' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent applications table */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 lg:col-span-2 overflow-x-auto">
              <h3 className="text-lg font-display font-bold text-gray-900 mb-6">RECENT APPLICATIONS</h3>
              {recentApplications.length === 0 ? (
                <div className="h-[220px] flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-mono text-gray-500 border border-gray-200 bg-gray-50 px-4 py-2 rounded">
                    NO ACTIVE DATA STREAMS DETECTED
                  </span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-mono text-xs uppercase">
                      <th className="pb-3 font-semibold">Job Title</th>
                      <th className="pb-3 font-semibold">Company</th>
                      <th className="pb-3 font-semibold">Location</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app, index) => (
                      <tr key={index} className="border-b border-gray-100 text-gray-900 hover:bg-gray-50/50">
                        <td className="py-3.5 font-display font-bold">{app.title}</td>
                        <td className="py-3.5 text-gray-500">{app.company}</td>
                        <td className="py-3.5 text-xs font-mono text-gray-500">{app.location || 'Remote'}</td>
                        <td className="py-3.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            app.status.toLowerCase() === 'hired'
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                              : app.status.toLowerCase() === 'rejected'
                              ? 'bg-red-50 border-red-100 text-red-700'
                              : 'bg-blue-50 border-blue-100 text-blue-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
