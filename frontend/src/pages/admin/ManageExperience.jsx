import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Save,
  X,
  Loader2,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    designation: '',
    duration: '',
    responsibilities: '',
    display_order: 0,
  });

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.getExperiences();
      if (res.success) {
        setExperiences(res.experiences);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch experience records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      company_name: '',
      designation: '',
      duration: '',
      responsibilities: '',
      display_order: experiences.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingItem(exp);
    const respList = Array.isArray(exp.responsibilities)
      ? exp.responsibilities
      : typeof exp.responsibilities === 'string'
      ? JSON.parse(exp.responsibilities || '[]')
      : [];

    setFormData({
      company_name: exp.company_name,
      designation: exp.designation,
      duration: exp.duration,
      responsibilities: respList.join('\n'),
      display_order: exp.display_order || 0,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_name || !formData.designation || !formData.duration) {
      showToast('Please fill in company name, designation, and duration.', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
      };

      if (editingItem) {
        const res = await api.updateExperience(editingItem.id, payload);
        if (res.success) {
          showToast('Experience updated successfully.');
        }
      } else {
        const res = await api.createExperience(payload);
        if (res.success) {
          showToast('Experience record added successfully.');
        }
      }

      setModalOpen(false);
      fetchExperiences();
    } catch (err) {
      showToast(err.message || 'Operation failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setSaving(true);
      const res = await api.deleteExperience(deleteModal.id);
      if (res.success) {
        showToast('Experience record deleted successfully.');
        fetchExperiences();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete experience.', 'error');
    } finally {
      setSaving(false);
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  if (loading && experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-xs font-mono text-zinc-500">Loading experience entries...</p>
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
        title="Delete Experience Entry"
        message={`Are you sure you want to delete the record for "${deleteModal.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
        loading={saving}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Experience Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage your career history, designations, durations, and key responsibilities.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List Table / Cards */}
      <div className="space-y-4">
        {experiences.map((exp) => {
          const respList = Array.isArray(exp.responsibilities)
            ? exp.responsibilities
            : typeof exp.responsibilities === 'string'
            ? JSON.parse(exp.responsibilities || '[]')
            : [];

          return (
            <div
              key={exp.id}
              className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                      #{exp.display_order}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-950">{exp.designation}</h3>
                  </div>
                  <p className="text-sm font-semibold text-zinc-700">{exp.company_name}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-zinc-600 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-lg">
                    {exp.duration}
                  </span>

                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
                    title="Edit Experience"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      setDeleteModal({
                        open: true,
                        id: exp.id,
                        title: `${exp.designation} at ${exp.company_name}`,
                      })
                    }
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Responsibilities list */}
              <div className="pt-3 border-t border-zinc-100 space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Key Responsibilities ({respList.length})
                </p>
                <ul className="space-y-1 text-xs text-zinc-600">
                  {respList.map((r, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {experiences.length === 0 && (
          <div className="p-12 text-center text-zinc-400 bg-zinc-50 rounded-2xl border border-zinc-200">
            No experience entries yet. Click "Add Experience" to create one.
          </div>
        )}
      </div>

      {/* Add / Edit Experience Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-950">
                {editingItem ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="e.g. KONCPT AI"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Designation / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Full Stack Developer"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Employment Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. Dec 2023 - Present"
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Responsibilities (One per line)
                </label>
                <textarea
                  rows="6"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="Developed full-stack web applications using React.js and Node.js.&#10;Integrated REST APIs and PostgreSQL databases."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                ></textarea>
                <p className="text-[11px] text-zinc-400">Each line will become a bullet point on the public portfolio.</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-zinc-950 hover:bg-black transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Experience' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
