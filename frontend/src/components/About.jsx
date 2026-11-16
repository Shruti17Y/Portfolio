import React from 'react';
import { Layers, Server, Database, ShieldCheck } from 'lucide-react';

export const About = ({ profile }) => {
  const aboutMe =
    profile?.about_me ||
    'I am a Full Stack Developer with hands-on experience in developing and maintaining real-world web applications. I work with React.js, JavaScript, Node.js, Express.js, Python, Django, PostgreSQL, and MongoDB. I have experience building REST APIs, implementing authentication and role-based access control, integrating payment gateways, and working with production applications.';

  const corePillars = [
    {
      icon: Layers,
      title: 'Frontend Engineering',
      description: 'Building clean, interactive user interfaces with React.js, modern JavaScript, and Tailwind CSS.',
    },
    {
      icon: Server,
      title: 'Backend & REST APIs',
      description: 'Developing high-throughput RESTful endpoints using Node.js, Express.js, Python, and Django.',
    },
    {
      icon: Database,
      title: 'Database Architecture',
      description: 'Designing normalized schemas, optimizing queries, and managing PostgreSQL, MongoDB, and IndexedDB.',
    },
    {
      icon: ShieldCheck,
      title: 'Auth & Payments',
      description: 'Integrating JWT-based RBAC authentication mechanisms, payment gateways (Razorpay), and secure workflows.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 font-mono">
            Background & Expertise
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            About Me
          </h2>
        </div>

        {/* Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed font-normal whitespace-pre-line">
              {aboutMe}
            </p>

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-zinc-100">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-zinc-950">Full Stack</p>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Specialization</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-zinc-950">REST APIs</p>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Architecture</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-zinc-950">PostgreSQL</p>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Relational DB</p>
              </div>
            </div>
          </div>

          {/* Core Pillars Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {corePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-zinc-900 text-sm">{pillar.title}</h3>
                      <p className="text-xs text-zinc-600 leading-relaxed">{pillar.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
