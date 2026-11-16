import React, { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { getAssetUrl, getFileNameFromUrl } from '../utils/fileName';

export const Navbar = ({ settings, profile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { label: 'Home', href: '#home', show: true },
    { label: 'About', href: '#about', show: sectionsEnabled.about !== false },
    { label: 'Experience', href: '#experience', show: sectionsEnabled.experience !== false },
    { label: 'Skills', href: '#skills', show: sectionsEnabled.skills !== false },
    { label: 'Projects', href: '#projects', show: sectionsEnabled.projects !== false },
    { label: 'Education', href: '#education', show: sectionsEnabled.education !== false },
    { label: 'Contact', href: '#contact', show: sectionsEnabled.contact !== false },
  ].filter(l => l.show);

  const logoText = settings?.logo_text || profile?.name || 'Shruti Patel';
  const resumeUrl = getAssetUrl(profile?.resume_url || settings?.resume_url || '/uploads/shruti_patel_resume.pdf');
  const resumeFileName = getFileNameFromUrl(resumeUrl);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white/90 backdrop-blur-md ${
        isScrolled ? 'border-b border-zinc-200 shadow-sm' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <a
          href="#home"
          className="group flex items-center text-zinc-900 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="font-semibold text-zinc-900 text-base sm:text-lg">
            {logoText}
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-100/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center space-x-3">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={resumeFileName}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-900 hover:bg-black rounded-xl transition-all shadow-sm hover:shadow"
          >
            <Download className="w-4 h-4" />
            <span className="max-w-40 truncate">Resume</span>
          </a>

        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={resumeFileName}
            aria-label={`Download ${resumeFileName}`}
            title={resumeFileName}
            className="p-2 text-zinc-800 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-700 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-6 py-4 space-y-2 animate-fade-in shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={resumeFileName}
              className="w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-zinc-900 rounded-xl"
            >
              {resumeFileName}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
