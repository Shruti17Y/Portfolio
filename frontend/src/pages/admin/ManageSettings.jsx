import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Toast } from '../../components/Toast';
import { Github, Linkedin } from '../../components/BrandIcons';
import {
  Settings,
  Save,
  Globe,
  Sliders,
  Check,
  Loader2,
  FileText,
  Mail,
} from 'lucide-react';

export const ManageSettings = () => {
  const [settings, setSettings] = useState({
    site_title: '',
    logo_text: '',
    footer_text: '',
    github_url: '',
    linkedin_url: '',
    email: '',
    resume_url: '',
    sections_enabled: {
      about: true,
      experience: true,
      skills: true,
      projects: true,
      education: true,
      contact: true,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSettings();
      if (res.success && res.settings) {
        let sections = {
          about: true,
          experience: true,
          skills: true,
          projects: true,
          education: true,
          contact: true,
        };

        if (res.settings.sections_enabled) {
          sections = typeof res.settings.sections_enabled === 'string'
            ? JSON.parse(res.settings.sections_enabled)
            : res.settings.sections_enabled;
        }

        setSettings({
          site_title: res.settings.site_title || 'Shruti Patel | Full Stack Developer',
          logo_text: res.settings.logo_text || 'Shruti Patel',
          footer_text: res.settings.footer_text || '© 2026 Shruti Patel. All rights reserved.',
          github_url: res.settings.github_url || 'https://github.com/shrutipatel',
          linkedin_url: res.settings.linkedin_url || 'https://linkedin.com/in/shruti-patel',
          email: res.settings.email || 'shrutipatel.dev@gmail.com',
          resume_url: res.settings.resume_url || '/uploads/shruti_patel_resume.pdf',
          sections_enabled: sections,
        });
      }
    } catch (err) {
      showToast(err.message || 'Failed to load website settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleFieldChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const toggleSection = (sectionKey) => {
    setSettings((prev) => ({
      ...prev,
      sections_enabled: {
        ...prev.sections_enabled,
        [sectionKey]: !prev.sections_enabled[sectionKey],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateSettings(settings);
      if (res.success) {
        showToast('Website settings saved successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-xs font-mono text-zinc-500">Loading website configuration...</p>
      </div>
    );
  }

  const sectionOptions = [
    { key: 'about', label: 'About Me Section', description: 'Core bio and technical focus areas' },
    { key: 'experience', label: 'Work Experience Section', description: 'Career timeline (KONCPT AI, Petpooja)' },
    { key: 'skills', label: 'Technical Skills Section', description: 'Categorized badges & technologies' },
    { key: 'projects', label: 'Projects Section', description: 'Live project cards & GitHub links' },
    { key: 'education', label: 'Education Section', description: 'B.Tech, HSC, SSC degree details' },
    { key: 'contact', label: 'Contact Section', description: 'Contact form & direct email links' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}

      {/* Header */}
      <div className="pb-6 border-b border-zinc-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
          Website Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Configure branding, website title, footer copyright, and toggle portfolio sections on or off.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Branding & SEO */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-zinc-950 pb-3 border-b border-zinc-100 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-zinc-600" />
            <span>Site Identity & Branding</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Browser Title Bar (SEO)
              </label>
              <input
                type="text"
                name="site_title"
                value={settings.site_title}
                onChange={handleFieldChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Navbar Logo / Brand Text
              </label>
              <input
                type="text"
                name="logo_text"
                value={settings.logo_text}
                onChange={handleFieldChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Footer Copyright Text
            </label>
            <input
              type="text"
              name="footer_text"
              value={settings.footer_text}
              onChange={handleFieldChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
            />
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-zinc-950 pb-3 border-b border-zinc-100 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-zinc-600" />
            <span>Portfolio Section Visibility</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Enable or disable sections on the public website. Disabled sections will not appear in the navbar or page body.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sectionOptions.map((sec) => {
              const isEnabled = settings.sections_enabled[sec.key] !== false;
              return (
                <div
                  key={sec.key}
                  onClick={() => toggleSection(sec.key)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isEnabled
                      ? 'bg-zinc-50/80 border-zinc-300'
                      : 'bg-white border-zinc-200 opacity-60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-zinc-900">{sec.label}</p>
                    <p className="text-xs text-zinc-500">{sec.description}</p>
                  </div>

                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                      isEnabled ? 'bg-zinc-900' : 'bg-zinc-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Links */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-zinc-950 pb-3 border-b border-zinc-100">
            Global Links & Resume Path
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Primary Contact Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleFieldChange}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Resume PDF Download Path
              </label>
              <input
                type="text"
                name="resume_url"
                value={settings.resume_url}
                onChange={handleFieldChange}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                GitHub URL
              </label>
              <input
                type="url"
                name="github_url"
                value={settings.github_url}
                onChange={handleFieldChange}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={settings.linkedin_url}
                onChange={handleFieldChange}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-zinc-950 text-white font-medium text-sm hover:bg-black transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
