import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

export const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect
  if (isAuthenticated) {
    window.location.href = '/admin/dashboard';
  }

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(credentials);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 text-zinc-900 font-sans">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </a>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
              Admin CMS Login
            </h1>
            <p className="text-xs text-zinc-500">
              Sign in to manage portfolio content and settings
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900 transition-colors"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900 transition-colors"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-zinc-950 text-white text-sm font-medium hover:bg-black transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          {/* <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-600 space-y-1 text-center">
            <p className="font-semibold text-zinc-900">Default Credentials:</p>
            <p className="font-mono text-[11px] text-zinc-700">Username: <span className="font-bold">admin</span> &bull; Password: <span className="font-bold">Admin@123</span></p>
          </div> */}
        </div>
      </div>
    </div>
  );
};
