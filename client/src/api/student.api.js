import api from './axios.config';

export const studentApi = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  uploadResume: (formData) => api.post('/student/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getJobs: () => api.get('/student/jobs'),
  getJob: (id) => api.get(`/student/jobs/${id}`),
  applyToJob: (id) => api.post(`/student/jobs/${id}/apply`),
  getApplications: () => api.get('/student/applications'),
  getDashboardStats: () => api.get('/student/dashboard/stats'),
};
