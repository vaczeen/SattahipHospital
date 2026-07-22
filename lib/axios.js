import axios from 'axios';

const api = axios.create();

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // clear store แล้ว redirect ไป login
      useEcomStore.getState().logout();
      window.location.href = '/inventory/login';
    }
    return Promise.reject(error);
  }
);

export default api;