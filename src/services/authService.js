// src/services/authService.js
import { request } from './api';

const authService = {

  // POST /api/auth/login
  login: async (email, password) => {
    const data = await request('POST', '/auth/login', { email, password }, false);
    if (data.token) {
      localStorage.setItem('forsa_token', data.token);
      localStorage.setItem('forsa_role', data.user?.role || data.role || '');
      if ((data.user?.role || data.role) === 'company') {
        localStorage.setItem('forsa_company_name', data.user?.name || '');
      }
    }
    return data;
  },

  // POST /api/auth/register/student
  registerStudent: async ({ name, email, password }) => {
    return await request('POST', '/auth/register/student', { name, email, password }, false);
  },

  // POST /api/auth/register/company
  registerCompany: async ({ companyName, email, password, industry, website }) => {
    return await request('POST', '/auth/register/company', {
      company_name: companyName,
      email,
      password,
      industry,
      website,
    }, false);
  },

  // GET /api/auth/me
  getMe: async () => {
    return await request('GET', '/auth/me');
  },

  logout: () => {
    localStorage.removeItem('forsa_token');
    localStorage.removeItem('forsa_role');
    localStorage.removeItem('forsa_company_name');
  },
};

export default authService;