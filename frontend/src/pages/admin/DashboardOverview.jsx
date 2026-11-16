import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  FolderGit2,
  Wrench,
  Briefcase,
  GraduationCap,
  MessageSquare,
  ArrowUpRight,
  Plus,
  Loader2,
  Clock,
  Mail,
  User,
  CheckCircle2,
} from 'lucide-react';

export const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.getDashboardStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-xs font-mono text-zinc-500">Loading dashboard data...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalProjects: 0,
    totalSkills: 0,
    totalExperiences: 0,
    totalEducation: 0,
    totalMessages: 0,
    unreadMessages: 0,
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderGit2,
      link: '/admin/projects',
      badge: 'Manage Projects',
    },
    {
      title: 'Technical Skills',
      value: stats.totalSkills,
      icon: Wrench,
      link: '/admin/skills',
      badge: 'Manage Skills',
    },
    {
      title: 'Experience Entries',
      value: stats.totalExperiences,
      icon: Briefcase,
      link: '/admin/experience',
      badge: 'Career History',
    },
    {
      title: 'Contact Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      link: '/admin/messages',
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : 'All read',
      badgeColor: stats.unreadMessages > 0 ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-zinc-100 text-zinc-700 border-zinc-200',
    },
    {
      title: 'Education Entries',
      value: stats.totalEducation,
      icon: GraduationCap,
      link: '/admin/education',
      badge: 'Degrees & HSC',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real-time management for Shruti Patel's portfolio and database.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/profile"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>
          <Link
            to="/admin/projects"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all hover:shadow-xs flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    card.badgeColor || 'bg-zinc-50 text-zinc-600 border-zinc-200'
                  }`}
                >
                  {card.badge}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-3xl font-bold text-zinc-950 tracking-tight">{card.value}</p>
                <p className="text-xs font-medium text-zinc-500 mt-1">{card.title}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Grid: Recent Inquiries & Projects Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-zinc-950">Recent Messages</h2>
              <p className="text-xs text-zinc-500">Contact submissions from portfolio visitors</p>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-semibold text-zinc-800 hover:text-black flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentMessages && data.recentMessages.length > 0 ? (
              data.recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    msg.is_read ? 'bg-zinc-50/50 border-zinc-200' : 'bg-white border-zinc-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-900">{msg.name}</p>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{msg.email} &bull; {msg.subject || 'General'}</p>
                  <p className="text-xs text-zinc-700 mt-2 line-clamp-2">{msg.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 py-6 text-center italic">No messages received yet.</p>
            )}
          </div>
        </div>

        {/* Recent Projects Preview */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-zinc-950">Projects Active</h2>
              <p className="text-xs text-zinc-500">Live projects in portfolio</p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-zinc-800 hover:text-black flex items-center space-x-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentProjects && data.recentProjects.length > 0 ? (
              data.recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-white transition-colors flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-zinc-900">{p.title}</p>
                    <p className="text-xs text-zinc-500 line-clamp-1">{p.description}</p>
                  </div>
                  {p.featured && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-white">
                      Featured
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 py-6 text-center italic">No projects found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
