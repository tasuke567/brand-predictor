// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://waka-api-hw3h.onrender.com",
  withCredentials: true,
});

export interface DashboardRow {
  id: string;
  brand: string;
  createdAt: string;
  user?: string;
}

/** ดึงรายการพร้อม filter + pagination */
export async function fetchDashboardRows(opts: {
  page: number;
  pageSize: number;
  search: string;
}) {
  const { data } = await axios.get<{
    items: DashboardRow[];
    total: number;
  }>("/api/admin/dashboard", { params: opts });
  return data;
}
