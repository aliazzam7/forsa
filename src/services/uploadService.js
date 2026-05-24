// src/services/uploadService.js
import { uploadFile } from './api';

const uploadService = {

  // POST /api/upload/avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return await uploadFile('/upload/avatar', formData);
  },
};

export default uploadService;