import { getToken, removeToken } from "../utils/token";
import axios from "axios";
const request = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor
request.interceptors.request.use(
  (config) => {
    const token = getToken(); // get token from localstorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // set request header
    }
    return config; // return config, continue sending request
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor: handle auth errors globally
request.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // token invalid or expired
      removeToken();
      window.location.href = "/login"; // redirect to login page

      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default request;
