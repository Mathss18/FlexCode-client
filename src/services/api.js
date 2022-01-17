import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (response) => {
    const status = response.response ? response.response.status : null;
    if (status === 401) {
      window.location.href = "/login";
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      console.log("Interceptado 401: ", localStorage.getItem("token"));
    }

    return Promise.reject(response);
  }
);

export default api;
