import React, { useContext, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LayoutDashboard, CheckSquare, Users, Settings, LogOut, Mountain } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // If inside a project
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = id ? [
    { name: 'Tasks', path: `/projects/${id}`, icon: CheckSquare },
    { name: 'Dashboard', path: `/projects/${id}/dashboard`, icon: LayoutDashboard },
    { name: 'Team', path: `/projects/${id}/team`, icon: Users },
    { name: 'Settings', path: `/projects/${id}/settings`, icon: Settings },
  ] : [
    { name: 'My Projects', path: '/projects', icon: LayoutDashboard }
  ];

  const NavItem = ({ link, mobile }) => {
    const isActive = location.pathname === link.path;
    const Icon = link.icon;
    const baseClass = "flex items-center gap-2 font-medium transition-colors hover:text-purple-600";
    const activeClass = isActive ? "text-purple-600" : "text-gray-500 dark:text-gray-400";
    const mobileClass = mobile ? "w-full p-4 border-b border-gray-100 dark:border-gray-800" : "text-sm";

    return (
      <Link 
        to={link.path} 
        className={`${baseClass} ${activeClass} ${mobileClass}`}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
      >
        <Icon size={18} />
        {link.name}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link to="/projects" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg">
              <Mountain size={20} />
            </div>
            <span className="hidden font-bold tracking-tight sm:inline-block">
              Team Task
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex md:gap-6">
            {navLinks.map(link => <NavItem key={link.name} link={link} />)}
          </div>
        </div>

        {/* User Actions & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex flex-col">
            {navLinks.map(link => <NavItem key={link.name} link={link} mobile />)}
            <div className="p-4 flex items-center justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 dark:bg-red-950/30"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
