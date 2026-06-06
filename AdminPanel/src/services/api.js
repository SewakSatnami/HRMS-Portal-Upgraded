import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
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
    const requestUrl = error.config?.url || '';
    const isAuthRequest = requestUrl.startsWith('/auth/login') ||
      requestUrl.startsWith('/auth/register') ||
      requestUrl.startsWith('/auth/refresh');

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  uploadProfileImage: async (formData) => {
    const response = await api.post('/auth/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};

// Employee API calls
export const employeeAPI = {
  getProfile: async () => {
    const response = await api.get('/employees/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/employees/profile', profileData);
    return response.data;
  },

  getMyAttendance: async (params = {}) => {
    const response = await api.get('/attendance/my', { params });
    return response.data;
  },

  markAttendance: async (attendanceData) => {
    const response = await api.post('/attendance/my', attendanceData);
    return response.data;
  },

  applyLeave: async (leaveData) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
  },

  getMyLeaves: async () => {
    const response = await api.get('/leaves/my');
    return response.data;
  },

  getLeaveBalance: async () => {
    const response = await api.get('/leaves/balance');
    return response.data;
  },

  getMySalary: async () => {
    const response = await api.get('/salaries/my');
    return response.data;
  },

  getMyPayslips: async () => {
    const response = await api.get('/payslips/my');
    return response.data;
  }
};

// Admin API calls
export const adminAPI = {
  // Employee management
  getAllEmployees: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  createEmployeeWithImage: async (formData) => {
    const response = await api.post('/employees', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Department management
  getDepartments: async (params = {}) => {
    const response = await api.get('/departments', { params });
    return response.data;
  },

  createDepartment: async (departmentData) => {
    const response = await api.post('/departments', departmentData);
    return response.data;
  },

  updateDepartment: async (id, departmentData) => {
    const response = await api.put(`/departments/${id}`, departmentData);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },

  // Attendance management
  markAttendance: async (attendanceData) => {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  },

  getEmployeeAttendance: async (employeeId, params = {}) => {
    const response = await api.get(`/attendance/${employeeId}`, { params });
    return response.data;
  },

  getAttendanceSummary: async (employeeId, params = {}) => {
    const response = await api.get(`/attendance/${employeeId}/summary`, { params });
    return response.data;
  },

  // Leave management
  getAllLeaveRequests: async (params = {}) => {
    const response = await api.get('/leaves', { params });
    return response.data;
  },

  applyLeave: async (leaveData) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
  },

  approveLeave: async (id, approvalData) => {
    const response = await api.put(`/leaves/${id}/approve`, approvalData);
    return response.data;
  },

  // Salary management
  addSalary: async (salaryData) => {
    const response = await api.post('/salaries', salaryData);
    return response.data;
  },

  getAllSalaries: async (params = {}) => {
    const response = await api.get('/salaries', { params });
    return response.data;
  },

  getSalary: async (employeeId) => {
    const response = await api.get(`/salaries/${employeeId}`);
    return response.data;
  },

  deleteSalary: async (id) => {
    const response = await api.delete(`/salaries/${id}`);
    return response.data;
  },

  // Payslip management
  generatePayslip: async (payslipData) => {
    const response = await api.post('/payslips/generate', payslipData);
    return response.data;
  },

  getAllPayslips: async (params = {}) => {
    const response = await api.get('/payslips', { params });
    return response.data;
  },

  getDashboardAnalytics: async () => {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  }
};

export default api;
