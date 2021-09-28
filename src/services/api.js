import axios from "axios";

const api = axios.create({
    baseURL: "https://dev.smartma.com.br/api",
});

export default api;