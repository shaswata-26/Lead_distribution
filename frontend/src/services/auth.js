import api from './api';

export const authService = {
  signup: (userData) => {
    return api.post('/auth/signup', userData);
  },

  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  getProfile: () => {
    return api.get('/auth/profile');
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};