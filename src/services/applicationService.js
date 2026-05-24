// src/services/applicationService.js
import { request } from './api';

const applicationService = {

  // POST /api/applications
  applyToJob: async (jobId) => {
    return await request('POST', '/applications', { job_id: jobId });
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