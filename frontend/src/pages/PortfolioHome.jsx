import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Experience } from '../components/Experience';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Education } from '../components/Education';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { Loader2 } from 'lucide-react';

export const PortfolioHome = () => {
  const [data, setData] = useState({
    profile: null,
    experiences: [],
    categories: [],
    projects: [],
    education: [],
    settings: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [
          profileRes,
          expRes,
          skillsRes,
          projRes,
          eduRes,
          settingsRes,
        ] = await Promise.all([
          api.getProfile().catch(() => ({ profile: null })),
          api.getExperiences().catch(() => ({ experiences: [] })),
          api.getSkills().catch(() => ({ categories: [] })),
          api.getProjects().catch(() => ({ projects: [] })),
          api.getEducation().catch(() => ({ education: [] })),
          api.getSettings().catch(() => ({ settings: null })),
        ]);

        setData({
          profile: profileRes?.profile || null,
          experiences: expRes?.experiences || [],
          categories: skillsRes?.categories || [],
          projects: projRes?.projects || [],
          education: eduRes?.education || [],
          settings: settingsRes?.settings || null,
        });

        // Set document title dynamically
        if (settingsRes?.settings?.site_title) {
          document.title = settingsRes.settings.site_title;
        } else if (profileRes?.profile?.name) {
          document.title = `${profileRes.profile.name} | ${profileRes.profile.designation || 'Portfolio'}`;
        }
      } catch (err) {
        console.error('Error loading portfolio data:', err);
        setError('Failed to load portfolio content. Please ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-sm font-medium text-zinc-500 font-mono">Loading developer portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 border border-zinc-200 rounded-3xl bg-zinc-50 space-y-4">
          <p className="text-zinc-900 font-bold text-lg">Unable to Load Portfolio</p>
          <p className="text-sm text-zinc-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-sm font-medium hover:bg-black transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { profile, experiences, categories, projects, education, settings } = data;

  const sectionsEnabled = (() => {
    try {
      if (!settings?.sections_enabled) return { about: true, experience: true, skills: true, projects: true, education: true, contact: true };
      return typeof settings.sections_enabled === 'string'
        ? JSON.parse(settings.sections_enabled)
        : settings.sections_enabled;
    } catch {
      return { about: true, experience: true, skills: true, projects: true, education: true, contact: true };
    }
  })();

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans">
      <Navbar settings={settings} profile={profile} />

      <main className="flex-1">
        <Hero profile={profile} settings={settings} />

        {sectionsEnabled.about !== false && (
          <About profile={profile} />
        )}

        {sectionsEnabled.experience !== false && (
          <Experience experiences={experiences} />
        )}

        {sectionsEnabled.skills !== false && (
          <Skills categories={categories} />
        )}

        {sectionsEnabled.projects !== false && (
          <Projects projects={projects} />
        )}

        {sectionsEnabled.education !== false && (
          <Education education={education} />
        )}

        {sectionsEnabled.contact !== false && (
          <Contact profile={profile} settings={settings} />
        )}
      </main>

      <Footer settings={settings} profile={profile} />
    </div>
  );
};
