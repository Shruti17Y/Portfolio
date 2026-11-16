import React, { useEffect, useState } from 'react';
import { Download, ArrowDown, Mail, ArrowRight, Code2 } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
import { getAssetUrl, getFileNameFromUrl } from '../utils/fileName';

export const Hero = ({ profile, settings }) => {
  const name = profile?.name || 'Shruti Patel';
  const designation = profile?.designation || 'Full Stack Developer';
  const introduction =
    profile?.introduction ||
    'I am a Full Stack Developer passionate about building scalable, responsive, and user-friendly web applications. I enjoy working across frontend and backend technologies, developing REST APIs, managing databases, and solving real-world problems through technology.';

  const resumeUrl = getAssetUrl(profile?.resume_url || settings?.resume_url || '/uploads/shruti_patel_resume.pdf');
  const resumeFileName = getFileNameFromUrl(resumeUrl);
  const githubUrl = profile?.github_url || settings?.github_url || 'https://github.com/shrutipatel';
  const linkedinUrl = profile?.linkedin_url || settings?.linkedin_url || 'https://linkedin.com/in/shruti-patel';
  const email = profile?.email || settings?.email || 'shrutipatel.dev@gmail.com';
  const [typedName, setTypedName] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedName(name);
      return undefined;
    }

    let characterIndex = 0;
    setTypedName('');
    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      setTypedName(name.slice(0, characterIndex));
      if (characterIndex === name.length) {
        window.clearInterval(typingTimer);
      }
    }, 110);

    return () => window.clearInterval(typingTimer);
  }, [name]);

  return (
    <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-28 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border border-emerald-200 bg-white/80 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Full-time Opportunities</span>
            </div>

            {/* Title & Name */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-950">
                Hello, I&apos;m
              </p>
              <h1 aria-label={name} className="min-h-[3rem] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950">
                <span className="bg-black bg-clip-text text-transparent">
                  {typedName}
                </span>
                <span className="typing-cursor text-black-100" aria-hidden="true">|</span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-zinc-600 tracking-tight">
                {designation}
              </p>
            </div>

            {/* Introduction paragraph */}
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl">
              {introduction}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={resumeFileName}
                className="inline-flex items-center space-x-2.5 px-6 py-2.5 rounded-xl bg-zinc-950 text-white font-medium text-sm hover:bg-black transition-all shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4" />
                <span className="max-w-56 truncate">Resume</span>
              </a>

              <a
                href="#projects"
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 font-medium text-sm hover:bg-zinc-50 hover:border-zinc-400 transition-all"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-4 flex items-center space-x-4 border-t border-zinc-200/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Connect
              </span>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${email}`}
                aria-label="Email Contact"
                className="p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Profile Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl p-3 bg-zinc-50 border border-zinc-200 shadow-sm group">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white border border-zinc-700 flex items-center justify-center">
                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400 p-6 space-y-4">
                    <div className="w-24 h-24 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                      <Code2 className="w-12 h-12 stroke-[1.5]" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-zinc-900 text-base">{name}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">React • Node • PostgreSQL</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating decorative mini-badge */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 border border-indigo-100 px-4 py-2.5 rounded-2xl shadow-lg flex items-center space-x-2.5 backdrop-blur">
                <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_0_4px_rgba(99,102,241,0.15)]"></div>
                <span className="text-xs font-semibold text-zinc-800">Full Stack Engineer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
