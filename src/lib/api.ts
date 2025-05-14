// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://waka-api-hw3h.onrender.com",
  withCredentials: true,
});
