import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supabase_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
// Auth API
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  signin: (data) => api.post('/api/auth/signin', data),
  signout: () => api.post('/api/auth/signout'),
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/profile', data)
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`)
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`)
};

// Cart API
export const cartAPI = {
  get: () => api.get('/api/cart'),
  add: (data) => api.post('/api/cart/add', data),
  update: (id, data) => api.put(`/api/cart/${id}`, data),
  remove: (id) => api.delete(`/api/cart/${id}`),
  clear: () => api.delete('/api/cart')
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  create: (data) => api.post('/api/orders', data),
  getAllAdmin: () => api.get('/api/orders/admin/all'),
  updateStatus: (id, data) => api.put(`/api/orders/${id}/status`, data)
};

// Upload API
export const uploadAPI = {
  uploadProduct: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/api/upload/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadCategory: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/api/upload/category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (bucket, path) => api.delete(`/api/upload/${bucket}/${path}`)
};

export default api;