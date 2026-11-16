const API_URL = import.meta.env.VITE_API_URL || 'https://portfolio-caym.onrender.com/api';
const BASE_URL = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

export default API_URL;

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('admin_token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Public APIs
  getProfile: () =>
    fetch(`${BASE_URL}/api/profile`).then(handleResponse),

  getExperiences: () =>
    fetch(`${BASE_URL}/api/experiences`).then(handleResponse),

  getSkills: () =>
    fetch(`${BASE_URL}/api/skills`).then(handleResponse),

  getProjects: () =>
    fetch(`${BASE_URL}/api/projects`).then(handleResponse),

  getEducation: () =>
    fetch(`${BASE_URL}/api/education`).then(handleResponse),

  getSettings: () =>
    fetch(`${BASE_URL}/api/settings`).then(handleResponse),

  sendMessage: (payload) =>
    fetch(`${BASE_URL}/api/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Auth APIs
  login: (credentials) =>
    fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE_URL}/api/auth/me`, {
      headers: getHeaders(),
    }).then(handleResponse),

  updateCredentials: (data) =>
    fetch(`${BASE_URL}/api/auth/credentials`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Profile CMS
  updateProfile: (profileData) =>
    fetch(`${BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    }).then(handleResponse),

  // Experience CMS
  createExperience: (data) =>
    fetch(`${BASE_URL}/api/experiences`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateExperience: (id, data) =>
    fetch(`${BASE_URL}/api/experiences/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteExperience: (id) =>
    fetch(`${BASE_URL}/api/experiences/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  reorderExperiences: (items) =>
    fetch(`${BASE_URL}/api/experiences/reorder`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ items }),
    }).then(handleResponse),

  // Skills CMS
  createCategory: (data) =>
    fetch(`${BASE_URL}/api/skills/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateCategory: (id, data) =>
    fetch(`${BASE_URL}/api/skills/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteCategory: (id) =>
    fetch(`${BASE_URL}/api/skills/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  createSkill: (data) =>
    fetch(`${BASE_URL}/api/skills`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateSkill: (id, data) =>
    fetch(`${BASE_URL}/api/skills/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteSkill: (id) =>
    fetch(`${BASE_URL}/api/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // Projects CMS
  createProject: (data) =>
    fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateProject: (id, data) =>
    fetch(`${BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteProject: (id) =>
    fetch(`${BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  reorderProjects: (items) =>
    fetch(`${BASE_URL}/api/projects/reorder`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ items }),
    }).then(handleResponse),

  // Education CMS
  createEducation: (data) =>
    fetch(`${BASE_URL}/api/education`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateEducation: (id, data) =>
    fetch(`${BASE_URL}/api/education/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteEducation: (id) =>
    fetch(`${BASE_URL}/api/education/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  reorderEducation: (items) =>
    fetch(`${BASE_URL}/api/education/reorder`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ items }),
    }).then(handleResponse),

  // Messages CMS
  getMessages: () =>
    fetch(`${BASE_URL}/api/messages`, {
      headers: getHeaders(),
    }).then(handleResponse),

  toggleMessageRead: (id, is_read) =>
    fetch(`${BASE_URL}/api/messages/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ is_read }),
    }).then(handleResponse),

  deleteMessage: (id) =>
    fetch(`${BASE_URL}/api/messages/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // Settings CMS
  updateSettings: (data) =>
    fetch(`${BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Dashboard Stats
  getDashboardStats: () =>
    fetch(`${BASE_URL}/api/stats/dashboard`, {
      headers: getHeaders(),
    }).then(handleResponse),

  // Upload file
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    }).then(handleResponse);
  },
};
