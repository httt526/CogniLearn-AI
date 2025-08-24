import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // backend API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // nếu backend có dùng cookie/session
});

export default axiosInstance;