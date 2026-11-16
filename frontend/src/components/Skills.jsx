import React from 'react';
import { Layout, Server, Database, Wrench, CheckCircle } from 'lucide-react';

export const Skills = ({ categories = [] }) => {
  const getCategoryIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('front')) return Layout;
    if (lower.includes('back')) return Server;
    if (lower.includes('data')) return Database;
    return Wrench;
  };

  return (
    <section id="skills" className="py-24 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="space-y-2 mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 font-mono">
            Technical Stack
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Skills & Competencies
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            const skillsList = category.skills || [];

            return (
              <div
                key={category.id}
                className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all hover:shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-100">
                  <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">{category.name}</h3>
                    <p className="text-xs text-zinc-500">{skillsList.length} technologies</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {skillsList.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 text-xs font-medium text-zinc-800 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
                      <span>{skill.name}</span>
                    </span>
                  ))}

                  {skillsList.length === 0 && (
                    <span className="text-xs text-zinc-400 italic">No skills listed in this category.</span>
                  )}
                </div>
              </div>
            );
          })}

          {categories.length === 0 && (
            <div className="col-span-full p-8 text-center text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200">
              No skills configured.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
