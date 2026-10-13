// services/inquiryService.js
import api from './api';
export const submitInquiry = (data) => api.post('/inquiries', data);
export const getInquiries = (params) => api.get('/inquiries', { params });
export const updateInquiry = (id, data) => api.put(`/inquiries/${id}`, data);
export const deleteInquiry = (id) => api.delete(`/inquiries/${id}`);
