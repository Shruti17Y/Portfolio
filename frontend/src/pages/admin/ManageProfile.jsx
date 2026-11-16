import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Toast } from '../../components/Toast';
import { Github, Linkedin } from '../../components/BrandIcons';
import { getAssetUrl, getFileNameFromUrl } from '../../utils/fileName';
import {
  User,
  Upload,
  FileText,
  Save,
  Loader2,
  Mail,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

export const ManageProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    designation: '',
    introduction: '',
    about_me: '',
    email: '',
    linkedin_url: '',
    github_url: '',
    profile_image: '',
    resume_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.getProfile();
        if (res.success && res.profile) {
          setProfile({
            name: res.profile.name || '',
            designation: res.profile.designation || '',
            introduction: res.profile.introduction || '',
            about_me: res.profile.about_me || '',
            email: res.profile.email || '',
            linkedin_url: res.profile.linkedin_url || '',
            github_url: res.profile.github_url || '',
            profile_image: res.profile.profile_image || '',
            resume_url: res.profile.resume_url || '',
          });
        }
      } catch (err) {
        showToast(err.message || 'Failed to fetch profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadFile(file);
      if (res.success && res.fileUrl) {
        setProfile((prev) => ({ ...prev, profile_image: res.fileUrl }));
        showToast('Profile image uploaded successfully.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload profile image.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingResume(true);
      const res = await api.uploadFile(file);
      if (res.success && res.fileUrl) {
        setProfile((prev) => ({ ...prev, resume_url: res.fileUrl }));
        showToast('Resume PDF uploaded successfully.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload resume.', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateProfile(profile);
      if (res.success) {
        showToast('Profile information updated successfully! Changes are live on your portfolio.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-xs font-mono text-zinc-500">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
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
          Profile Management
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Edit your core personal branding, About Me section, profile image, and resume.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Profile Image & Resume Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Photo */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-zinc-600" />
              <span>Profile Image</span>
            </h3>

            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                {profile.profile_image ? (
                  <img
                    src={getAssetUrl(profile.profile_image)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-zinc-400" />
                )}
              </div>

              <div className="space-y-2 flex-1">
                <label className="cursor-pointer inline-flex items-center space-x-2 px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-zinc-400">JPG, PNG, WebP up to 10MB</p>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Or direct Image URL:
              </label>
              <input
                type="text"
                name="profile_image"
                value={profile.profile_image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full mt-1 px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Resume PDF */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-zinc-600" />
              <span>Resume PDF</span>
            </h3>

            <div className="space-y-2">
              <label className="cursor-pointer inline-flex items-center space-x-2 px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingResume ? 'Uploading...' : 'Upload New Resume PDF'}</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="hidden"
                />
              </label>

              {profile.resume_url && (
                <div className="flex items-center space-x-2 text-xs text-zinc-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <a
                    href={getAssetUrl(profile.resume_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-900 font-semibold underline truncate"
                  >
                    {getFileNameFromUrl(profile.resume_url)}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Or Resume URL / Path:
              </label>
              <input
                type="text"
                name="resume_url"
                value={profile.resume_url}
                onChange={handleChange}
                placeholder="/uploads/shruti_patel_resume.pdf"
                className="w-full mt-1 px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-zinc-950 pb-3 border-b border-zinc-100">
            Personal & Career Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Designation / Title
              </label>
              <input
                type="text"
                name="designation"
                value={profile.designation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Hero Introduction */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Hero Section Introduction
            </label>
            <textarea
              name="introduction"
              rows="3"
              value={profile.introduction}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
            ></textarea>
            <p className="text-[11px] text-zinc-500">Displayed prominently in the Hero Section above the CTA buttons.</p>
          </div>

          {/* About Me */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
              About Me Section Content
            </label>
            <textarea
              name="about_me"
              rows="5"
              value={profile.about_me}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
            ></textarea>
            <p className="text-[11px] text-zinc-500">Comprehensive overview of your expertise, frameworks, and experience.</p>
          </div>
        </div>

        {/* Social & Contact Links */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-zinc-950 pb-3 border-b border-zinc-100">
            Contact & Social Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Contact Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="linkedin_url"
                  value={profile.linkedin_url}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
                <Linkedin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                GitHub Profile URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="github_url"
                  value={profile.github_url}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
                <Github className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-zinc-950 text-white font-medium text-sm hover:bg-black transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
