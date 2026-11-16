import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Github } from '../../components/BrandIcons';
import { getAssetUrl } from '../../utils/fileName';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  Upload,
  ExternalLink,
  Star,
  X,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

export const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    image_url: '',
    github_url: '',
    live_demo_url: '',
    featured: false,
    display_order: 0,
    project_type: 'personal',
    company_name: '',
  });

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.getProjects();
      if (res.success) {
        setProjects(res.projects || []);
      }
      const experienceRes = await api.getExperiences();
      const companyNames = [...new Set(
        (experienceRes.experiences || [])
          .map((experience) => experience.company_name?.trim())
          .filter(Boolean)
      )];
      setCompanies(companyNames);
    } catch (err) {
      showToast(err.message || 'Failed to fetch projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      image_url: '',
      github_url: '',
      live_demo_url: '',
      featured: false,
      display_order: projects.length + 1,
      project_type: 'personal',
      company_name: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    const techList = Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === 'string'
      ? JSON.parse(project.technologies || '[]')
      : [];

    setFormData({
      title: project.title,
      description: project.description,
      technologies: techList.join(', '),
      image_url: project.image_url || '',
      github_url: project.github_url || '',
      live_demo_url: project.live_demo_url || '',
      featured: Boolean(project.featured),
      display_order: project.display_order || 0,
      project_type: project.project_type || 'personal',
      company_name: project.company_name || '',
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadFile(file);
      if (res.success && res.fileUrl) {
        setFormData((prev) => ({ ...prev, image_url: res.fileUrl }));
        showToast('Project image uploaded successfully.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload project image.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showToast('Please enter project title and description.', 'error');
      return;
    }
    if (formData.project_type === 'company' && !formData.company_name) {
      showToast('Please select a company for this project.', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingProject) {
        await api.updateProject(editingProject.id, payload);
        showToast('Project updated successfully.');
      } else {
        await api.createProject(payload);
        showToast('Project created successfully.');
      }

      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      showToast(err.message || 'Failed to save project.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setSaving(true);
      await api.deleteProject(deleteModal.id);
      showToast('Project deleted successfully.');
      fetchProjects();
    } catch (err) {
      showToast(err.message || 'Delete project failed.', 'error');
    } finally {
      setSaving(false);
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-xs font-mono text-zinc-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
        loading={saving}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Project Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Showcase your real-world software applications, technologies, GitHub repos, and live demos.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const techList = Array.isArray(proj.technologies)
            ? proj.technologies
            : typeof proj.technologies === 'string'
            ? JSON.parse(proj.technologies || '[]')
            : [];

          return (
            <div
              key={proj.id}
              className="rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-2xs flex flex-col justify-between overflow-hidden"
            >
              {/* Image banner */}
              <div className="h-40 bg-zinc-50 border-b border-zinc-100 relative overflow-hidden flex items-center justify-center">
                {proj.image_url ? (
                  <img
                    src={getAssetUrl(proj.image_url)}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-zinc-300 flex flex-col items-center justify-center space-y-1">
                    <FolderGit2 className="w-10 h-10" />
                    <span className="text-[11px] font-mono text-zinc-400">No Image Preview</span>
                  </div>
                )}

                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  {proj.featured && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>Featured</span>
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-xs text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                    #{proj.display_order}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-zinc-950">{proj.title}</h3>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {proj.project_type === 'company' && proj.company_name
                      ? `Company Project · ${proj.company_name}`
                      : 'Personal Project'}
                  </p>
                  <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">{proj.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {techList.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md border border-zinc-200 bg-zinc-50 text-[10px] font-mono text-zinc-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-zinc-500">
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-zinc-900 inline-flex items-center space-x-1"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {proj.live_demo_url && (
                        <a
                          href={proj.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-zinc-900 inline-flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            id: proj.id,
                            title: proj.title,
                          })
                        }
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="col-span-full p-12 text-center text-zinc-400 bg-zinc-50 rounded-2xl border border-zinc-200">
            No projects added yet. Click "Add New Project" to add your work.
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-950">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Freedom Foundation"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Project Ownership
                  </label>
                  <select
                    value={formData.project_type}
                    onChange={(e) => setFormData({
                      ...formData,
                      project_type: e.target.value,
                      company_name: e.target.value === 'personal' ? '' : formData.company_name,
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                  >
                    <option value="personal">Personal Project</option>
                    <option value="company">Company Project</option>
                  </select>
                </div>

                {formData.project_type === 'company' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                    >
                      <option value="">Select a company</option>
                      {companies.map((company) => (
                        <option key={company} value={company}>{company}</option>
                      ))}
                    </select>
                    {companies.length === 0 && (
                      <p className="text-[11px] text-zinc-500">
                        Add an experience entry first to create a company project.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the platform architecture, core features, modules, and target audience..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Technology Stack (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React.js, Node.js, Express.js, PostgreSQL, Razorpay"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
              </div>

              {/* Project Image */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Project Screenshot / Image</span>
                  </label>

                  <label className="cursor-pointer inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-100">
                    <Upload className="w-3 h-3" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Or enter direct image URL / path (/uploads/...)"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/shrutipatel/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.live_demo_url}
                    onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded-sm border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <label htmlFor="featured" className="text-xs font-medium text-zinc-800 cursor-pointer">
                  Mark as Featured Project on homepage
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl text-sm font-medium text-white bg-zinc-950 hover:bg-black transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
