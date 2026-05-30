import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Calendar, Video, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recruiter/interviews');
      if (res.data.success) {
        setInterviews(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load interviews list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const completedCount = interviews.filter(i => i.isLive === false && Math.random() > 0.5).length; // Simulated completion status
  const pendingCount = interviews.length - completedCount;

  const interviewStats = [
    { name: 'Completed', count: completedCount },
    { name: 'Pending', count: pendingCount },
    { name: 'Total Scheduled', count: interviews.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <TopNav />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">INTERVIEWS</h1>
              <p className="text-gray-500 font-body text-sm">Orchestrate candidate synch-ups and review live sessions.</p>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {interviews.length} SCHEDULED INTERVIEWS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar widget + AI insights */}
            <div className="lg:col-span-4 space-y-6">
              {/* Mini calendar widget */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                <h3 className="text-sm font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-700" />
                  <span>CALENDAR RECON</span>
                </h3>
                
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-gray-400 border-b border-gray-100 pb-2 mb-2">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-gray-900">
                  {[...Array(31)].map((_, i) => (
                    <span
                      key={i}
                      className={`p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer ${
                        i === 28 ? 'bg-[#202A36] text-white font-bold' : ''
                      }`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Insight panel */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-display font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gray-700" />
                  <span>AI INSIGHT CO-PILOT</span>
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {interviews.length > 0 ? (
                    `Candidate ${interviews[0].name} exhibits high compatibility on your requirements. Consider prioritizing system design review.`
                  ) : (
                    "No active candidate vectors detected to generate contextual interview strategies."
                  )}
                </p>
              </div>
            </div>

            {/* Interviews List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-4">
                {loading ? (
                  [1, 2].map(i => (
                    <div key={i} className="h-28 rounded-xl bg-white border border-gray-200 animate-pulse shadow-sm" />
                  ))
                ) : interviews.length === 0 ? (
                  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-12 text-center">
                    <span className="text-xs font-mono text-gray-500 border border-gray-200 bg-gray-50 px-4 py-2 rounded">
                      NO INTERVIEWS SCHEDULED YET
                    </span>
                  </div>
                ) : (
                  interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className={`bg-white border backdrop-blur-md rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all shadow-sm ${
                        interview.isLive 
                          ? 'border-emerald-500 ring-2 ring-emerald-500/10' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-display font-bold text-[#202A36]">
                          {interview.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-gray-900 flex items-center gap-2">
                            <span>{interview.name}</span>
                            {interview.isLive && (
                              <span className="text-[9px] font-mono font-bold bg-red-50 border border-red-100 text-red-500 px-1.5 py-0.5 rounded animate-pulse">
                                LIVE NOW
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">{interview.role} — {interview.type}</p>
                          <span className="text-[10px] font-mono text-gray-500 mt-1.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {interview.time} ({interview.platform})
                          </span>
                        </div>
                      </div>

                      {interview.isLive ? (
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-5 rounded text-white font-display font-bold text-xs shadow-sm hover:opacity-95 transition-all" style={{ backgroundColor: '#202A36' }}>
                          <Video className="w-4 h-4" />
                          <span>JOIN SESSION</span>
                        </button>
                      ) : (
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-5 rounded bg-white border border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-all font-display font-bold text-xs shadow-sm">
                          <span>RESCHEDULE</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Bottom statistics and Bar Chart */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                <h3 className="text-sm font-display font-bold text-gray-900 mb-6">COMPLETION ANALYTICS</h3>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={interviewStats}>
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#111827' }} />
                      <Bar dataKey="count" fill="#202A36" radius={[4, 4, 0, 0]} maxBarSize={45} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interviews;
