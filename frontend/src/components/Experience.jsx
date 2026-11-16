import React from 'react';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

export const Experience = ({ experiences = [] }) => {
  return (
    <section id="experience" className="py-24 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="space-y-2 mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 font-mono">
            Career Journey
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Work Experience
          </h2>
        </div>

        {/* Timeline / Card List */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 sm:before:left-8 before:w-px before:bg-zinc-200">
          {experiences.map((exp, index) => {
            const responsibilities = Array.isArray(exp.responsibilities)
              ? exp.responsibilities
              : typeof exp.responsibilities === 'string'
              ? JSON.parse(exp.responsibilities || '[]')
              : [];

            return (
              <div key={exp.id || index} className="relative pl-12 sm:pl-20 group">
                {/* Timeline node */}
                <div className="absolute left-3.5 sm:left-6.5 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-zinc-900 shadow group-hover:scale-125 transition-transform"></div>

                {/* Experience Card */}
                <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all hover:shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-zinc-100">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-950">
                        {exp.designation}
                      </h3>
                      <p className="text-base font-semibold text-zinc-800 mt-0.5">
                        {exp.company_name}
                      </p>
                    </div>

                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-700 w-fit">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <ul className="mt-5 space-y-2.5">
                    {responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start space-x-3 text-sm text-zinc-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0"></span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          {experiences.length === 0 && (
            <div className="p-8 text-center text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200">
              No experience records found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
