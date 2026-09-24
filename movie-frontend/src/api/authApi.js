import apiClient from './apiClient';

export const signup = (payload) => apiClient.post('/api/auth/signup', payload);
export const login = (payload) => apiClient.post('/api/auth/login', payload);
