// src/lib/api.ts
import axios from "axios";

const token = localStorage.getItem("token");
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://waka-api-hw3h.onrender.com",
  withCredentials: true,
  // ส่ง cookie ให้ backend
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
