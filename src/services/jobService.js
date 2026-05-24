// src/services/jobService.js
import { request } from './api';

const jobService = {

  // GET /api/jobs
  getAllJobs: async () => {
    return await request('GET', '/jobs', null, false);
  },

  // GET /api/jobs/:id
  getJobById: async (jobId) => {
    return await request('GET', `/jobs/${jobId}`, null, false);
  },
};

export default jobService;
