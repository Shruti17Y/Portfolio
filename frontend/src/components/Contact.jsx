import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
import { api } from '../services/api';

export const Contact = ({ profile, settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const email = profile?.email || settings?.email || 'shrutipatel.dev@gmail.com';
  const linkedinUrl = profile?.linkedin_url || settings?.linkedin_url || 'https://linkedin.com/in/shruti-patel';
  const githubUrl = profile?.github_url || settings?.github_url || 'https://github.com/shrutipatel';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage({ type: 'error', text: 'Please fill in your name, email, and message.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await api.sendMessage(formData);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Thank you! Your message has been received. I will get back to you shortly.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Failed to send message. Please try again.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="space-y-2 mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 font-mono">
            Get In Touch
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Contact Me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Links */}
          <div className="lg:col-span-5 space-y-8">
            <p className="text-base text-zinc-600 leading-relaxed">
              Have a project in mind, opportunities to discuss, or want to collaborate on something exciting? Feel free to reach out via the form or through my profiles below.
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-4 p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-all hover:shadow-xs group"
              >
                <div className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-medium text-zinc-900">{email}</p>
                </div>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-all hover:shadow-xs group"
              >
                <div className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">LinkedIn</p>
                  <p className="text-sm font-medium text-zinc-900">Connect on LinkedIn</p>
                </div>
              </a>

              {/* <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-all hover:shadow-xs group"
              >
                <div className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">GitHub</p>
                  <p className="text-sm font-medium text-zinc-900">Explore Repositories</p>
                </div>
              </a> */}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl border border-zinc-400 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-zinc-950 mb-6">
                Send a Message
              </h3>

              {statusMessage.text && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-start space-x-3 text-sm border ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-red-50 text-red-900 border-red-200'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 text-sm focus:outline-hidden focus:bg-white focus:border-zinc-900 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 text-sm focus:outline-hidden focus:bg-white focus:border-zinc-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 text-sm focus:outline-hidden focus:bg-white focus:border-zinc-900 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hello Shruti, I'd like to discuss..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 text-sm focus:outline-hidden focus:bg-white focus:border-zinc-900 transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-xl bg-zinc-950 text-white font-medium text-sm hover:bg-black transition-all shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
