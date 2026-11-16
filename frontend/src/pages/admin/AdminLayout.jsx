import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Wrench,
  FolderGit2,
  GraduationCap,
  MessageSquare,
  Settings,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const AdminLayout = () => {
  const { admin, logout, isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <p className="text-sm font-mono text-zinc-500">Checking credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/admin/login';
    return null;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/admin/profile', icon: User },
    { label: 'Experience', path: '/admin/experience', icon: Briefcase },
    { label: 'Technical Skills', path: '/admin/skills', icon: Wrench },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Education', path: '/admin/education', icon: GraduationCap },
    { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings },
    { label: 'Account Security', path: '/admin/account', icon: KeyRound },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-zinc-900">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-200 bg-white fixed inset-y-0 z-30">
        {/* Brand */}
        <div className="h-20 px-6 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-mono text-xs font-bold">
              CMS
            </div>
            <div>
              <p className="font-bold text-sm text-zinc-900">Admin Panel</p>
              <p className="text-[11px] text-zinc-500">Portfolio CMS</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom user & logout */}
        <div className="p-4 border-t border-zinc-100 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-zinc-900 truncate">{admin?.username || 'Admin'}</p>
              <p className="text-[10px] text-zinc-500 truncate">{admin?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white border-r border-zinc-200 flex flex-col h-full shadow-2xl z-10 animate-fade-in">
            <div className="h-16 px-6 border-b border-zinc-100 flex items-center justify-between">
              <span className="font-bold text-sm text-zinc-900">Admin CMS</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-zinc-500 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-zinc-900 text-white'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-zinc-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md sticky top-0 z-20 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-700 hover:bg-zinc-100 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
              Portfolio Content Management
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              <span>View Public Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
