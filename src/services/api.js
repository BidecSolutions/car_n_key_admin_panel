import axios from 'axios';
import { mockAPI } from './mockData';
import { meta } from '@eslint/js';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_BASE_URL,
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const USE_MOCK_DATA = false; // Set to false when real API is available

export const authAPI = {
  loginAdmin: (data) => api.post("/auth/admin/login", data),
  loginUser: (data) => api.post("/user/login", data),
  updateProfile : (data, id) => api.post(`admin/${id}/update` ,data),
  changePassword: (data) => api.post("/admin/change-password", data),
};

// Colors API
export const colorsAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/colors'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/colors/${id}`),
  create: (data) => api.post('/admin/colors', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/colors/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/colors/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/colors/${id}/toggle-status`),
};

// Brands API
export const brandsAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/brands'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/brands/${id}`),
  create: (data) => api.post('/admin/brands', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/brands/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/brands/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/brands/${id}/toggle-status`),
};

// BodyType API
export const bodyTypeAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/body-types'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/body-types/${id}`),
  create: (data) => api.post('/admin/body-types', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/body-types/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/body-types/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/body-types/${id}/toggle-status`),
};

// FuelType API
export const fuelTypeAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/fuel-types'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/fuel-types/${id}`),
  create: (data) => api.post('/admin/fuel-types', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/fuel-types/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/fuel-types/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/fuel-types/${id}/toggle-status`),
};

// EngineType API
export const engineTypeAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/engine-types'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/engine-types/${id}`),
  create: (data) => api.post('/admin/engine-types', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/engine-types/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/engine-types/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/engine-types/${id}/toggle-status`),
};

// Vehical Modal API
export const vehicalModalAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/vehicle-models'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/vehicle-models/${id}`),
  create: (data) => api.post('/admin/vehicle-models', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/vehicle-models/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/vehicle-models/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/vehicle-models/${id}/toggle-status`),
};

// Feature Modal API
export const featuresAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/features'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/features/${id}`),
  create: (data) => api.post('/admin/features', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/features/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/features/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/features/${id}/toggle-status`),
};

// Feature Category Modal API
export const featureCategoryAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/feature-categories'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/feature-categories/${id}`),
  create: (data) => api.post('/admin/feature-categories', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/feature-categories/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/feature-categories/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/feature-categories/${id}/toggle-status`),
};

// Trim Modal API
export const trimAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/trims'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/trims/${id}`),
  create: (data) => api.post('/admin/trims', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/trims/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/trims/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/trims/${id}/toggle-status`),
};

// Faqs Modal API
export const faqsAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.doctors.getAll() : api.get('/admin/faqs'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/admin/faqs/${id}`),
  create: (data) => api.post('/admin/faqs/bulk', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.doctors.update(id, data) : api.put(`/admin/faqs/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.doctors.delete(id) : api.delete(`/admin/faqs/${id}`),
  toggle_status: (id) => USE_MOCK_DATA ? mockAPI.doctors.put(id) : api.put(`/admin/faqs/${id}/toggle-status`),
};

// Doctors API
export const doctorsAPI = {
  getAll: () =>  api.get('/doctors'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.doctors.getById(id) : api.get(`/doctors/${id}`),
  create: (data) =>  api.post('/admin/doctors/store', data , {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  update: (id, data) => api.post(`/admin/doctors/${id}/update`, data),
  delete: (id) => api.delete(`/admin/doctors/${id}/delete`),
};

// Tests API
export const testsAPI = {
  getAll: () =>   api.get('/tests'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.tests.getById(id) : api.get(`/tests/${id}`),
  create: (data) => api.post('/admin/tests/store', data),
  update: (id, data) => api.post(`/admin/tests/${id}/update`, data),
  delete: (id) =>  api.delete(`/admin/tests/${id}/delete`),
};

// Branches API
export const BranchesAPI = {
  getAll: () => api.get('/branches'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.tests.getById(id) : api.get(`/tests/${id}`),
  create: (data) => api.post('/admin/branches/store', data),
  update: (id, data) => api.post(`/admin/branches/${id}/update`, data),
  delete: (id) => api.delete(`/admin/branches/${id}/delete`),
  toggleStatus: (id) => api.delete(`admin/branches/${id}/toggle-status`),
};
// category API
export const testCategoriesAPI = {
  getAll: () => api.get('/test-category'),
  getById: (id) => api.get(`/test-category/${id}`),
  create: (data) => api.post('admin/test-category/store', data),
  update: (id, data) => api.post(`admin/test-category/${id}/update`, data),
  delete: (id) => api.delete(`admin/test-category/${id}/delete`),
};


export const codesAPI = {
  getAll: () => api.get('/admin/codes'),
  getById: (id) => api.get(`/admin/codes/${id}`),
  getCodesByType: (type) => api.get(`/admin/codes/${type}`),
  create: (data) => api.post('/admin/codes/store', data),
  update: (id, data) => api.post(`/admin/codes/${id}`, data),
  delete: (id) => api.delete(`/test-category/${id}`),
};


export const heroAPI = {
  getAll: () => api.get('/admin/hero'),
  getById: (id) => api.get(`/test-category/${id}`),
  create: (data) =>
    api.post('admin/hero/store', data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
   update: (id, data) =>
    api.post(`admin/hero/${id}/update`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/test-category/${id}`),
};

export const usersAPI = {
  getAll: () =>  api.get('/admin/admins'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.users.getById(id) : api.get(`/users/${id}`),
  create: (data) =>  api.post('/admin/admins', data),
  update: (id, data) =>  api.post(`/admin/admins/${id}`, data),
  delete: (id) =>  api.delete(`/admin/${id}/delete`),
};

export const rolesAPI = {
  getAll: () =>  api.get('/admin/roles'),
  create: (data) =>  api.post('/admin/roles', data),
  update: (id, data) => api.post(`/admin/roles/${id}`, data),
  delete: (id) =>  api.delete(`/admin/roles/${id}`),
};

export const AssignRoleAdmins = {
  getAll: () =>  api.get('/admin/list-admin-roles'),
  create: (data) =>  api.post('/admin/assign-role-admin', data),
  update: (id, data) => api.post(`/admin/update-roles/${id}`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.roles.delete(id) : api.delete(`/roles/${id}`),
};

export const permissionsAPI = {
  getAll: () => api.get('/admin/permissions'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.permissions.getById(id) : api.get(`/permissions/${id}`),
  create: (data) =>  api.post('/admin/permissions', data),
  update: (id, data) =>  api.post(`/admin/permissions/${id}`, data),
  delete: (id) =>api.delete(`/admin/permissions/destroy/${id}`),
};
export const customersAPI = {
  getAll: () => USE_MOCK_DATA ? mockAPI.users.getAll() : api.get('admin/user'),
  getById: (id) => USE_MOCK_DATA ? mockAPI.users.getById(id) : api.get(`admin/user/${id}/edit`),
  create: (data) => USE_MOCK_DATA ? mockAPI.users.create(data) : api.post('admin/user/store', data),
  update: (id, data) => USE_MOCK_DATA ? mockAPI.users.update(id, data) : api.post(`admin/user/${id}/update`, data),
  delete: (id) => USE_MOCK_DATA ? mockAPI.users.delete(id) : api.delete(`admin/user/${id}/changeactiveInactive`),
};

export const contactApi = {
  getAll: () => api.get('/admin/contacts'),
};
export const CareerApi = {
  getAll: () => api.get('/admin/careers'),
  delete: (id) => api.delete(`/admin/careers/${id}/delete`),
};


export default api; 