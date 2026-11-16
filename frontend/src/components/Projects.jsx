import React from 'react';
import { ExternalLink, FolderGit2, Star } from 'lucide-react';
import { Github } from './BrandIcons';
import { getAssetUrl } from '../utils/fileName';

export const Projects = ({ projects = [] }) => {
  return (
    <section id="projects" className="py-24 bg-zinc-50/70 border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="space-y-3 mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 font-mono">
            Featured Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Projects
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-zinc-500">
            A selection of products and platforms built with thoughtful engineering, clear UX, and scalable foundations.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const techList = Array.isArray(project.technologies)
              ? project.technologies
              : typeof project.technologies === 'string'
              ? JSON.parse(project.technologies || '[]')
              : [];

            return (
              <div
                key={project.id}
                className="group rounded-2xl border border-zinc-200 bg-white hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/60 flex flex-col overflow-hidden"
              >
                {/* Project Image or Visual Header */}
                <div className="h-48 sm:h-52 bg-zinc-50 border-b border-zinc-100 relative overflow-hidden flex items-center justify-center">
                  {project.image_url ? (
                    <img
                      src={getAssetUrl(project.image_url)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2 p-6">
                      <div className="p-3 rounded-2xl bg-white border border-zinc-200 text-zinc-700 shadow-2xs group-hover:scale-110 transition-transform">
                        <FolderGit2 className="w-8 h-8 stroke-[1.5]" />
                      </div>
                      <span className="text-xs font-mono text-zinc-500">{project.title}</span>
                    </div>
                  )}

                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs border border-zinc-200 px-3 py-1 rounded-full text-xs font-medium text-zinc-800 shadow-xs flex items-center space-x-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-zinc-950 group-hover:text-black transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      {project.project_type === 'company' && project.company_name
                        ? `Company Project · ${project.company_name}`
                        : 'Personal Project'}
                    </p>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Technology Tags */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {techList.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-zinc-50 text-[11px] font-mono text-zinc-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="pt-4 border-t border-zinc-100 flex items-center space-x-4">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-800 hover:text-black transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span>Code Repository</span>
                        </a>
                      )}

                      {project.live_demo_url && (
                        <a
                          href={project.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-800 hover:text-black transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div className="col-span-full p-8 text-center text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200">
              No projects configured.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
