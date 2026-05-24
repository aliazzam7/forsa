// src/services/companyService.js
import { request, uploadFile } from './api';

const companyService = {

  // GET /api/company/dashboard
  getDashboard: async () => {
    return await request('GET', '/company/dashboard');
  },

  // GET /api/company/profile
  getProfile: async () => {
    return await request('GET', '/company/profile');
  },

  // PUT /api/company/profile
  updateProfile: async (profileData) => {
    return await request('PUT', '/company/profile', profileData);
  },

  // PUT /api/company/change-password
  changePassword: async (currentPassword, newPassword) => {
    return await request('PUT', '/company/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  // GET /api/company/jobs
  getMyJobs: async () => {
    return await request('GET', '/company/jobs');
  },

  // POST /api/company/jobs
  postJob: async (jobData) => {
    return await request('POST', '/company/jobs', jobData);
  },

  // PUT /api/company/jobs/:id
  updateJob: async (jobId, jobData) => {
    return await request('PUT', `/company/jobs/${jobId}`, jobData);
  },

  // DELETE /api/company/jobs/:id
  deleteJob: async (jobId) => {
    return await request('DELETE', `/company/jobs/${jobId}`);
  },

  // POST /api/company/upload-logo  — field name: "logo"
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return await uploadFile('/company/upload-logo', formData);
  },
};

export default companyService;