import React from 'react';
import { GraduationCap, Award, Calendar } from 'lucide-react';

export const Education = ({ education = [] }) => {
  return (
    <section id="education" className="py-24 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="space-y-2 mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 font-mono">
            Academic Background
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Education
          </h2>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {education.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-6 sm:p-7 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all hover:shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200">
                    <GraduationCap className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  {item.duration && (
                    <span className="text-xs font-medium text-zinc-500 font-mono bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
                      {item.duration}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-zinc-950 text-base leading-snug">
                    {item.degree}
                  </h3>
                  <p className="text-sm font-medium text-zinc-600">
                    {item.institute_name}
                  </p>
                </div>
              </div>

              {/* Academic Results Badge */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center space-x-2 text-xs font-semibold text-zinc-900">
                <Award className="w-4 h-4 text-zinc-700" />
                <span>{item.academic_results}</span>
              </div>
            </div>
          ))}

          {education.length === 0 && (
            <div className="col-span-full p-8 text-center text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200">
              No education records found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
