import api from './axios.config';

export const jobApi = {
  getPublicJobs: (params) => api.get('/jobs/public', { params }),
};
