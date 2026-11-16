import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Tag,
  FolderPlus,
} from 'lucide-react';

export const ManageSkills = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Skill modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category_id: '',
    icon_name: '',
    display_order: 0,
  });

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({
    name: '',
    display_order: 0,
  });

  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null, title: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.getSkills();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch skills.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Skill Handlers
  const openAddSkill = (catId = '') => {
    setEditingSkill(null);
    setSkillForm({
      name: '',
      category_id: catId || (categories[0]?.id || ''),
      icon_name: '',
      display_order: 0,
    });
    setSkillModalOpen(true);
  };

  const openEditSkill = (skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      category_id: skill.category_id,
      icon_name: skill.icon_name || '',
      display_order: skill.display_order || 0,
    });
    setSkillModalOpen(true);
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    if (!skillForm.name || !skillForm.category_id) {
      showToast('Please provide a skill name and select a category.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingSkill) {
        await api.updateSkill(editingSkill.id, skillForm);
        showToast('Skill updated successfully.');
      } else {
        await api.createSkill(skillForm);
        showToast('New skill added successfully.');
      }
      setSkillModalOpen(false);
      fetchSkills();
    } catch (err) {
      showToast(err.message || 'Failed to save skill.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Category Handlers
  const openAddCategory = () => {
    setEditingCat(null);
    setCatForm({ name: '', display_order: categories.length + 1 });
    setCatModalOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name, display_order: cat.display_order || 0 });
    setCatModalOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catForm.name) {
      showToast('Please enter a category name.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingCat) {
        await api.updateCategory(editingCat.id, catForm);
        showToast('Category updated successfully.');
      } else {
        await api.createCategory(catForm);
        showToast('Category created successfully.');
      }
      setCatModalOpen(false);
      fetchSkills();
    } catch (err) {
      showToast(err.message || 'Failed to save category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setSaving(true);
      if (deleteModal.type === 'category') {
        await api.deleteCategory(deleteModal.id);
        showToast('Category and its skills deleted successfully.');
      } else {
        await api.deleteSkill(deleteModal.id);
        showToast('Skill deleted successfully.');
      }
      fetchSkills();
    } catch (err) {
      showToast(err.message || 'Delete operation failed.', 'error');
    } finally {
      setSaving(false);
      setDeleteModal({ open: false, type: '', id: null, title: '' });
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-xs font-mono text-zinc-500">Loading technical skills...</p>
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
        title={deleteModal.type === 'category' ? 'Delete Skill Category' : 'Delete Skill'}
        message={
          deleteModal.type === 'category'
            ? `Are you sure you want to delete category "${deleteModal.title}"? All associated skills will also be permanently removed.`
            : `Are you sure you want to delete skill "${deleteModal.title}"?`
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, type: '', id: null, title: '' })}
        loading={saving}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Skills Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Organize competencies into categorized groups (Frontend, Backend, Database, Tools).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openAddCategory}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Category</span>
          </button>

          <button
            onClick={() => openAddSkill()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Categories & Skills Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-5"
          >
            {/* Category header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                  #{cat.display_order}
                </span>
                <h3 className="font-bold text-base text-zinc-950">{cat.name}</h3>
                <span className="text-xs text-zinc-400">({cat.skills?.length || 0})</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAddSkill(cat.id)}
                  className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                  title="Add skill to this category"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditCategory(cat)}
                  className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                  title="Rename Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setDeleteModal({
                      open: true,
                      type: 'category',
                      id: cat.id,
                      title: cat.name,
                    })
                  }
                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-2">
              {cat.skills && cat.skills.length > 0 ? (
                cat.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-300 transition-colors text-xs font-medium text-zinc-800"
                  >
                    <span>{skill.name}</span>
                    <div className="flex items-center space-x-1 pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditSkill(skill)}
                        className="text-zinc-400 hover:text-zinc-700"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            type: 'skill',
                            id: skill.id,
                            title: skill.name,
                          })
                        }
                        className="text-red-400 hover:text-red-600"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic py-2">No skills in this category yet.</p>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full p-12 text-center text-zinc-400 bg-zinc-50 rounded-2xl border border-zinc-200">
            No skill categories found. Click "New Category" to start.
          </div>
        )}
      </div>

      {/* Add / Edit Skill Modal */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-base font-bold text-zinc-950">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button
                onClick={() => setSkillModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSkillSubmit} className="space-y-4 mt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Skill Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. React.js, PostgreSQL"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={skillForm.category_id}
                  onChange={(e) => setSkillForm({ ...skillForm, category_id: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Display Order
                </label>
                <input
                  type="number"
                  value={skillForm.display_order}
                  onChange={(e) => setSkillForm({ ...skillForm, display_order: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl text-sm font-medium text-white bg-zinc-950 hover:bg-black transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingSkill ? 'Update Skill' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-base font-bold text-zinc-950">
                {editingCat ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4 mt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Cloud & DevOps"
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
                  value={catForm.display_order}
                  onChange={(e) => setCatForm({ ...catForm, display_order: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-hidden focus:bg-white focus:border-zinc-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl text-sm font-medium text-white bg-zinc-950 hover:bg-black transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCat ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
