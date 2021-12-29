import axios from "axios";

const api = axios.create({
  baseURL: "https://dev.smartma.com.br/api",
});

api.interceptors.request.use((config) => {
  config.headers.authorization = "Bearer " + localStorage.getItem("token");
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
      console.log("Interceptado 401: ", localStorage.getItem("token"));
    }

    return Promise.reject(response);
  }
);

export default api;
