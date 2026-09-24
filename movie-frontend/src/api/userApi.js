import apiClient from './apiClient';

export const getUsers = () => apiClient.get('/api/users');
export const getUserById = (userId) => apiClient.get(`/api/users/${userId}`);
