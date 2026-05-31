import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  HelpCircle, 
  LogOut, 
  User 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleClose = () => setIsOpen(false);
    window.addEventListener('toggle_sidebar', handleToggle);
    window.addEventListener('close_sidebar', handleClose);
    return () => {
      window.removeEventListener('toggle_sidebar', handleToggle);
      window.removeEventListener('close_sidebar', handleClose);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Job Postings', path: '/student/jobs', icon: Briefcase },
    { name: 'Profile', path: '/student/profile', icon: User },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  const recruiterLinks = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Talent Pool', path: '/recruiter/talent-pool', icon: Users },
    { name: 'Job Postings', path: '/recruiter/my-jobs', icon: Briefcase },
    { name: 'Interviews', path: '/recruiter/interviews', icon: Calendar },
    { name: 'Analytics', path: '/recruiter/analytics', icon: BarChart3 },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : studentLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/45 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`w-64 fixed inset-y-0 left-0 bg-white border-r border-gray-200 flex flex-col z-40 transform transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header/Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 gap-2">
          <div className="w-8 h-8 rounded bg-[#202A36] flex items-center justify-center font-display font-bold text-white shadow-sm">
            HX
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-gray-900">
            Hire<span className="text-[#202A36]">X</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile / Logout */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm">
              {(() => {
                if (!user?.name) return 'U';
                const parts = user.name.trim().split(/\s+/);
                if (parts.length >= 2) {
                  return (parts[0][0] + parts[1][0]).toUpperCase();
                }
                return parts[0].slice(0, 2).toUpperCase();
              })()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-display font-bold text-gray-900 truncate">{user?.name || 'User'}</h4>
              <span className="text-xs font-mono text-gray-500 capitalize">{user?.role || 'Guest'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded bg-white border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-500 transition-all font-body text-sm font-semibold shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
