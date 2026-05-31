import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { HelpCircle, MessageSquare, Send, BookOpen, Clock } from 'lucide-react';

const Support = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Initialize HireX Concierge. Ask me about sync, billing, api, or talent.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getBotResponse = (text) => {
    const txt = text.toLowerCase();
    if (txt.includes('sync')) {
      return "To synchronize your resume database, upload a PDF resume in your student profile page.";
    }
    if (txt.includes('billing')) {
      return "We support standard billing intervals. Contact billing@hirex.co for invoice records.";
    }
    if (txt.includes('api')) {
      return "API access tokens expire after 7 days. Query using the Authorization Bearer header.";
    }
    if (txt.includes('talent')) {
      return "Recruiters can explore candidates sorted by vector similarity in the Talent Directory.";
    }
    return "I am the HireX Concierge. Try asking keywords like: 'sync', 'billing', 'api', or 'talent'.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotResponse(currentInput);
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  const categories = [
    { title: 'Getting Started', desc: 'Platform overview, candidate registrations, and recruiter launchpads.' },
    { title: 'AI Calibration', desc: 'Understanding cosine vector similarity and resume text parser limits.' },
    { title: 'Billing & Tiers', desc: 'Managing subscriptions, recruiter quotas, and invoice ledgers.' },
    { title: 'Technical Logs', desc: 'Reviewing API responses, Render build steps, and database connectivity.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <TopNav />

      <main className="pl-0 md:pl-64 pt-16 min-h-screen">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">SUPPORT HELPDESK</h1>
              <p className="text-gray-500 font-body text-sm">Query the knowledge index or converse with our AI concierge agent.</p>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SUPPORT PIPELINE ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Knowledge base */}
            <div className="lg:col-span-7 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((c, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all cursor-pointer shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-800 mb-4">
                      <BookOpen className="w-5 h-5 text-gray-700" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-gray-900 mb-1">{c.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>

              {/* Trending articles */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span>TRENDING ARTICLES</span>
                </h3>
                <ul className="space-y-3 text-xs text-gray-600 font-body">
                  <li className="hover:text-emerald-600 cursor-pointer transition-colors">1. Resolving CORS errors on Render deployments</li>
                  <li className="hover:text-emerald-600 cursor-pointer transition-colors">2. Re-triggering JSearch RapidAPI connections</li>
                  <li className="hover:text-emerald-600 cursor-pointer transition-colors">3. Optimizing cosine similarity threshold indicators</li>
                </ul>
              </div>
            </div>

            {/* AI Concierge Chat widget */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-gray-200 rounded-xl h-[460px] flex flex-col justify-between overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <span className="font-display font-bold text-xs text-gray-900">AI CONCIERGE ASSISTANT</span>
                </div>

                {/* Message bubbles */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 font-body text-xs">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 leading-relaxed border ${
                          m.sender === 'user'
                            ? 'bg-[#202A36] border-[#202A36] text-white font-semibold rounded-br-none'
                            : 'bg-gray-50 border-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg rounded-bl-none p-3 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-gray-50 flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask concierge..."
                    className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:border-gray-400 transition-colors"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded text-white transition-colors"
                    style={{ backgroundColor: '#202A36' }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;
