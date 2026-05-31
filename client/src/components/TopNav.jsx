import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Settings, User as UserIcon, LogOut, Check, Shield, Menu } from 'lucide-react';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [notificationsList, setNotificationsList] = useState([]);

  const studentDefaults = [
    { id: 'def1', title: 'Welcome to HireX!', desc: 'Please complete your student profile and upload a PDF resume to match with jobs.', time: 'Just now', unread: true },
    { id: 'def2', title: 'Job matching active', desc: 'Browse available software engineering job opportunities and check compatibility.', time: '1 hour ago', unread: false }
  ];

  const recruiterDefaults = [
    { id: 'def1', title: 'Welcome to HireX!', desc: 'You can now post new job vacancies and check candidates who applied to them.', time: 'Just now', unread: true },
    { id: 'def2', title: 'Candidates directory active', desc: 'Browse matched candidate profile details in the Talent Pool page.', time: '1 hour ago', unread: false }
  ];

  useEffect(() => {
    const loadNotifs = () => {
      const notifKey = user ? `notifications_${user.id || user._id}` : 'notifications_guest';
      const saved = localStorage.getItem(notifKey);
      if (saved) {
        setNotificationsList(JSON.parse(saved));
      } else {
        const defaults = user?.role === 'recruiter' ? recruiterDefaults : studentDefaults;
        setNotificationsList(defaults);
        localStorage.setItem(notifKey, JSON.stringify(defaults));
      }
    };

    loadNotifs();

    window.addEventListener('new_notification', loadNotifs);
    window.addEventListener('storage', loadNotifs);
    const interval = setInterval(loadNotifs, 2000);

    return () => {
      window.removeEventListener('new_notification', loadNotifs);
      window.removeEventListener('storage', loadNotifs);
      clearInterval(interval);
    };
  }, [user]);

  const handleToggleNotifications = () => {
    const nextShow = !showNotifications;
    setShowNotifications(nextShow);
    setShowSettings(false);
    setShowProfileMenu(false);
    
    if (nextShow) {
      const updated = notificationsList.map(n => ({ ...n, unread: false }));
      setNotificationsList(updated);
      const notifKey = user ? `notifications_${user.id || user._id}` : 'notifications_guest';
      localStorage.setItem(notifKey, JSON.stringify(updated));
      window.dispatchEvent(new Event('new_notification'));
    }
  };

  return (
    <header className="h-16 fixed top-0 left-0 md:left-64 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Icon for Mobile */}
        <button
          onClick={() => window.dispatchEvent(new Event('toggle_sidebar'))}
          className="p-2 -ml-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-display text-xs md:text-sm font-bold text-gray-900 leading-tight">
            {getGreeting()}, <span className="text-gray-800 font-semibold">{user?.name || 'Guest'}</span>
          </h2>
          {user?.role === 'recruiter' && user?.company && (
            <span className="text-[9px] md:text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 block md:inline-block w-max mt-0.5 md:mt-0">
              {user.company}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={handleToggleNotifications}
            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {notificationsList.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30 font-body text-xs">
              <div className="px-4 py-2 border-b border-gray-100 font-bold text-gray-800 flex justify-between">
                <span>Notifications</span>
                <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">Active</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notificationsList.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 font-mono">
                    NO NEW NOTIFICATIONS
                  </div>
                ) : (
                  notificationsList.map(n => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 space-y-1 transition-colors ${n.unread ? 'bg-[#202A36]/5' : ''}`}>
                      <h4 className="font-semibold text-gray-900 flex justify-between items-center">
                        <span>{n.title}</span>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                      </h4>
                      <p className="text-gray-500 text-[11px] leading-relaxed">{n.desc}</p>
                      <span className="text-[10px] text-gray-400 font-mono block">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon & Dropdown */}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); setShowProfileMenu(false); }}
            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-30 font-body text-xs text-gray-700 space-y-3">
              <h4 className="font-bold border-b border-gray-100 pb-2 mb-2 text-gray-800">System Preferences</h4>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                <span>Enable email notifications</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                <span>Auto-calibrate similarity vectors</span>
              </label>
              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                <span>Theme: Premium Light</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowSettings(false); }}
            className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-display text-xs font-bold text-gray-700 hover:border-gray-400 transition-all focus:outline-none"
          >
            {(() => {
              if (!user?.name) return 'HX';
              const parts = user.name.trim().split(/\s+/);
              if (parts.length >= 2) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
              }
              return parts[0].slice(0, 2).toUpperCase();
            })()}
          </button>


          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30 font-body text-xs">
              <div className="px-4 py-3 border-b border-gray-100 space-y-1">
                <h4 className="font-bold text-gray-900 capitalize">{user?.name}</h4>
                <p className="text-gray-500 text-[11px] truncate">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-mono capitalize bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                    {user?.role} Portal
                  </span>
                </div>
              </div>

              {user?.role === 'student' && (
                <Link 
                  to="/student/profile" 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span>My Profile</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-red-500 hover:bg-red-50/20 transition-colors flex items-center gap-2 border-t border-gray-100"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
