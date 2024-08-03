import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', 
  timeout: 10000,
});
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
            const { access } = response.data;
            localStorage.setItem('token', access);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            return axios(originalRequest);
          } catch (err) {
            console.error('Token refresh failed', err);
          }
        }
      }
      return Promise.reject(error);
    }
  );

export default api;