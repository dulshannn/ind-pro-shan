// services/vehicleService.js
import api from './api';
export const getVehicles = (params) => api.get('/vehicles', { params });
export const getVehicleById = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (data) => api.post('/vehicles', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
