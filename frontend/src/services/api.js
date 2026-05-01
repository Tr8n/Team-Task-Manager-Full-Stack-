import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signup';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/signup', userData),
  login: (userData) => api.post('/auth/login', userData),
  users: () => api.get('/users'),
};

export const projectsAPI = {
  create: (payload) => api.post('/projects', payload),
  list: () => api.get('/projects'),
  addMember: (projectId, userId) => api.patch(`/projects/${projectId}/members`, { userId }),
};

export const tasksAPI = {
  create: (payload) => api.post('/tasks', payload),
  list: (params = {}) => api.get('/tasks', { params }),
  updateStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }),
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
  admin: () => api.get('/dashboard/admin'),
};

export default api; 