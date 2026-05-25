// src/services/applicationService.js

import { request, uploadFile } from './api';

const applicationService = {

  // POST /api/applications — supports cover letter + optional CV file
  applyToJob: async (jobId, coverLetter = '', cvFile = null) => {
    if (cvFile) {
      // multipart/form-data (file present)
      const formData = new FormData();
      formData.append('job_id', jobId);
      formData.append('cover_letter', coverLetter);
      formData.append('cv', cvFile);
      return await uploadFile('/applications', formData);
    }
    // JSON (no file)
    return await request('POST', '/applications', {
      job_id: jobId,
      cover_letter: coverLetter,
    });
  },

  // PUT /api/applications/:id/status
  updateStatus: async (applicationId, status) => {
    return await request('PUT', `/applications/${applicationId}/status`, { status });
  },

  // GET /api/company/applications/:id
  getJobApplicants: async (jobId) => {
    return await request('GET', `/company/applications/${jobId}`);
  },
};

export default applicationService;