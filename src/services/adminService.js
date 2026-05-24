// src/services/adminService.js
import { request } from './api';

const adminService = {

  // GET /api/admin/dashboard
  getDashboard: async () => {
    return await request('GET', '/admin/dashboard');
  },

  // ─── USERS ───────────────────────────────────────────────────

  // GET /api/admin/users
  getAllUsers: async () => {
    return await request('GET', '/admin/users');
  },

  // PUT /api/admin/users/:id/ban  — body: { ban: true/false }
  banUser: async (userId, ban) => {
    return await request('PUT', `/admin/users/${userId}/ban`, { ban });
  },

  // PUT /api/admin/users/:id  — edit name/email
  updateUser: async (userId, data) => {
    return await request('PUT', `/admin/users/${userId}`, data);
  },

  // DELETE /api/admin/users/:id
  deleteUser: async (userId) => {
    return await request('DELETE', `/admin/users/${userId}`);
  },

  // ─── COMPANIES ───────────────────────────────────────────────

  // GET /api/admin/companies
  getAllCompanies: async () => {
    return await request('GET', '/admin/companies');
  },

  // PUT /api/admin/companies/:id/approve  — body: { approve: true/false }
  approveCompany: async (companyId, approve) => {
    return await request('PUT', `/admin/companies/${companyId}/approve`, { approve });
  },

  // PUT /api/admin/companies/:id/ban  — body: { ban: true/false }
  banCompany: async (companyId, ban) => {
    return await request('PUT', `/admin/companies/${companyId}/ban`, { ban });
  },

  // PUT /api/admin/companies/:id/status  — body: { status: 'pending'|'approved'|'banned'|'rejected' }
  updateCompanyStatus: async (companyId, status) => {
    return await request('PUT', `/admin/companies/${companyId}/status`, { status });
  },

  // DELETE /api/admin/companies/:id
  deleteCompany: async (companyId) => {
    return await request('DELETE', `/admin/companies/${companyId}`);
  },

  // ─── JOBS ─────────────────────────────────────────────────────

  // GET /api/admin/jobs
  getAllJobs: async () => {
    return await request('GET', '/admin/jobs');
  },

  // PUT /api/admin/jobs/:id/status  — body: { status: 'active'|'spam'|'deleted' }
  updateJobStatus: async (jobId, status) => {
    return await request('PUT', `/admin/jobs/${jobId}/status`, { status });
  },

  // DELETE /api/admin/jobs/:id
  deleteJob: async (jobId) => {
    return await request('DELETE', `/admin/jobs/${jobId}`);
  },

  // ─── ADMIN PROFILE ────────────────────────────────────────────

  // GET /api/admin/profile
  getProfile: async () => {
    return await request('GET', '/admin/profile');
  },

  // PUT /api/admin/profile  — body: { name, email, avatar }
  updateProfile: async (data) => {
    return await request('PUT', '/admin/profile', data);
  },

  // PUT /api/admin/change-password
  changePassword: async (currentPassword, newPassword) => {
    return await request('PUT', '/admin/change-password', {
      current_password: currentPassword,
      new_password:     newPassword,
    });
  },
};

export default adminService;
