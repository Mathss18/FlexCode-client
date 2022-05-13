import axios from "axios";

var dominio = window.location.hostname;
dominio = dominio.split('.')
var requestUrl = '';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  requestUrl = `http://${dominio[0]}.api.${dominio[1]}:8000/api` // dev url
} else {
  requestUrl = `https://${dominio[0]}.api.${dominio[1]}.com/api` // dev url
}

const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: requestUrl
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
