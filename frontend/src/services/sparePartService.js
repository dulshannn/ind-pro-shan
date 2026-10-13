// services/sparePartService.js
import api from './api';
export const getSpareParts = (params) => api.get('/spareparts', { params });
export const getSparePartById = (id) => api.get(`/spareparts/${id}`);
export const createSparePart = (data) => api.post('/spareparts', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateSparePart = (id, data) => api.put(`/spareparts/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteSparePart = (id) => api.delete(`/spareparts/${id}`);
