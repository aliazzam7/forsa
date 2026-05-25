// src/services/studentService.js
import { request, uploadFile } from './api';

const studentService = {

  // GET /api/student/dashboard
  getDashboard: async () => {
    return await request('GET', '/student/dashboard');
  },

  // GET /api/student/profile
  getProfile: async () => {
    return await request('GET', '/student/profile');
  },

  // PUT /api/student/profile
  updateProfile: async (profileData) => {
    return await request('PUT', '/student/profile', profileData);
  },

  // PUT /api/student/change-password
  changePassword: async (currentPassword, newPassword) => {
    return await request('PUT', '/student/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  // GET /api/student/applications
  getMyApplications: async () => {
    return await request('GET', '/student/applications');
  },

  // POST /api/student/upload-cv  — field name: "cv"
  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append('cv', file);
    return await uploadFile('/student/upload-cv', formData);
  },

deleteCV: async () => {
  return await request('DELETE', '/student/cv');
},


  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return await uploadFile('/student/upload-avatar', formData);
  },

};


export default studentService;