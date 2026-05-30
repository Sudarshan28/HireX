import api from './axios.config';

export const recruiterApi = {
  getProfile: () => api.get('/recruiter/profile'),
  updateProfile: (data) => api.put('/recruiter/profile', data),
  createJob: (jobData) => api.post('/recruiter/jobs', jobData),
  getJobs: () => api.get('/recruiter/jobs'),
  getJob: (id) => api.get(`/recruiter/jobs/${id}`),
  updateJob: (id, data) => api.put(`/recruiter/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/recruiter/jobs/${id}`), // Close or delete job
  getApplicants: (jobId) => api.get(`/recruiter/jobs/${jobId}/applicants`),
  updateApplicantStatus: (jobId, studentId, status) => api.put(`/recruiter/jobs/${jobId}/applicants/${studentId}`, { status }),
  getDashboardStats: () => api.get('/recruiter/dashboard/stats'),
};
