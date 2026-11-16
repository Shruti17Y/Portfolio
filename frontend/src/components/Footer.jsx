import React from 'react';
import { Mail } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';

export const Footer = ({ settings, profile }) => {
  const currentYear = new Date().getFullYear();
  const name = profile?.name || 'Shruti Patel';
  const designation = profile?.designation || 'Full Stack Developer';
  const introduction =
    profile?.introduction ||
    'Building scalable, responsive, and user-friendly web applications with thoughtful design and clean code.';
  const email = profile?.email || settings?.email || 'shrutipatel.dev@gmail.com';
  const githubUrl = profile?.github_url || settings?.github_url || 'https://github.com/shrutipatel';
  const linkedinUrl =
    profile?.linkedin_url || settings?.linkedin_url || 'https://linkedin.com/in/shruti-patel';
  const footerText =
    settings?.footer_text ||
    `© ${currentYear} ${name}. All rights reserved.`;

  return (
    <footer className="border-t border-zinc-200 bg-white px-6 py-10 sm:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <a
          href="#home"
          className="text-xl font-bold tracking-tight text-zinc-950 transition-colors hover:text-zinc-600 sm:text-4xl"
        >
          {name}
        </a>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          {designation}
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
          {introduction}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${email}`}
            aria-label="Email Contact"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-10 border-t border-zinc-100 pt-6 text-xs text-zinc-500">
          <p>{footerText}</p>
        </div>
      </div>
    </footer>
  );
};
