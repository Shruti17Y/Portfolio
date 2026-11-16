import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Award,
  Calendar,
  X,
  Loader2,
} from 'lucide-react';

export const ManageEducation = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    degree: '',
    institute_name: '',
    duration: '',
    academic_results: '',
    display_order: 0,
  });

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await api.getEducation();
      if (res.success) {
        setEducationList(res.education || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch education records.', 'error');
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
      degree: '',
      institute_name: '',
      duration: '',
      academic_results: '',
      display_order: educationList.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      degree: item.degree,
      institute_name: item.institute_name,
      duration: item.duration || '',
      academic_results: item.academic_results,
      display_order: item.display_order || 0,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree || !formData.institute_name || !formData.academic_results) {
      showToast('Please fill in degree, institute name, and academic results.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingItem) {
        await api.updateEducation(editingItem.id, formData);
        showToast('Education record updated successfully.');
      } else {
        await api.createEducation(formData);
        showToast('Education record created successfully.');
      }
      setModalOpen(false);
      fetchEducation();
    } catch (err) {
      showToast(err.message || 'Failed to save education record.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setSaving(true);
      await api.deleteEducation(deleteModal.id);
      showToast('Education entry deleted successfully.');
      fetchEducation();
    } catch (err) {
      showToast(err.message || 'Failed to delete education entry.', 'error');
    } finally {
      setSaving(false);
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  if (loading && educationList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-xs font-mono text-zinc-500">Loading education entries...</p>
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
        title="Delete Education Record"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
        loading={saving}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Education Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage academic degrees, institutes, percentiles, and graduation timelines.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Education Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {educationList.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                  #{item.display_order}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                    title="Edit Education"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModal({
                        open: true,
                        id: item.id,
                        title: item.degree,
                      })
                    }
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Education"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-base text-zinc-950">{item.degree}</h3>
                <p className="text-xs font-semibold text-zinc-600">{item.institute_name}</p>
                {item.duration && (
                  <p className="text-[11px] font-mono text-zinc-400">{item.duration}</p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center space-x-1.5 text-xs font-semibold text-zinc-800">
              <Award className="w-4 h-4 text-zinc-600" />
              <span>{item.academic_results}</span>
            </div>
          </div>
        ))}

        {educationList.length === 0 && (
          <div className="col-span-full p-12 text-center text-zinc-400 bg-zinc-50 rounded-2xl border border-zinc-200">
            No education entries found. Click "Add Education" to create one.
          </div>
        )}
      </div>

      {/* Add / Edit Education Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-base font-bold text-zinc-950">
                {editingItem ? 'Edit Education' : 'Add Education'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Degree / Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.Tech in Computer Science / IT"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Institute Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institute_name}
                  onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
                  placeholder="e.g. LJ Institute of Engineering and Technology"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Academic Results / Score <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.academic_results}
                  onChange={(e) => setFormData({ ...formData, academic_results: e.target.value })}
                  placeholder="e.g. Semester 3 SPI: 8.46 / 10 or 74.09 percentile"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 2023 - 2027"
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
                  {saving ? 'Saving...' : editingItem ? 'Update Education' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
