import axios from "axios";

const api = axios.create({
    baseURL: "https://dev.smartma.com.br/api",
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
});

export default api;