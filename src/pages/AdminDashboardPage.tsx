// src/pages/AdminDashboardPage.tsx
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/StatCard";
import { AdminTable, Row } from "@/components/AdminTable";
import { Button } from "@/components/Button";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { api } from "@/lib/api";

interface StatResp {
  total: number;
  accuracy: number;
  top3: { brand: string; total: number }[];
}

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<StatResp | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: s }, { data: q }] = await Promise.all([
        api.get<StatResp>("/stats/brands"),
        api.get<any[]>("/admin/questionnaire"),
      ]);

      setStats(s);
      setRows(
        q.map((x) => ({
          id: x.id,
          brand: x.prediction?.label ?? "—",
          createdAt: x.createdAt,
          user: x.user?.email ?? "anonymous",
        }))
      );
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err.message ?? "Load failed");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm(`Delete questionnaire #${id}?`)) return;
    try {
      await api.delete(`/admin/questionnaire/${id}`);
      setRows((r) => r.filter((x) => x.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </header>

        {/* Error Message */}
        {error && (
          <div className="rounded bg-rose-100 text-rose-700 px-4 py-3 text-sm font-medium shadow">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Section */}
        {loading ? (
          <div className="grid sm:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"
              />
            ))}
          </div>
        ) : stats ? (
          <>
            <section className="grid sm:grid-cols-3 gap-4">
              <StatCard title="Total forms" value={stats.total} />
              <StatCard
                title="Accuracy"
                value={
                  typeof stats.accuracy === "number"
                    ? (stats.accuracy * 100).toFixed(1) + "%"
                    : "-"
                }
              />
              <StatCard
                title="Top brand"
                value={stats.top3?.[0]?.brand ?? "No data"}
              />
            </section>

            {/* Pie Chart */}
            <section className="w-full h-72 border rounded-xl bg-white dark:bg-gray-900 p-4 shadow">
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Brand Prediction Share
              </h3>
              {stats.top3 && stats.top3.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={stats.top3}
                      dataKey="total"
                      nameKey="brand"
                      outerRadius={110}
                      label={({ brand }) => brand}
                    >
                      {["#4f46e5", "#f59e0b", "#10b981"].map((c, i) => (
                        <Cell key={i} fill={c} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                  ไม่มีข้อมูลสำหรับแสดงกราฟ 🥲
                </div>
              )}
            </section>
          </>
        ) : null}

        {/* Table Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              Questionnaire List
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={load}
                disabled={loading}
              >
                🔄 Refresh
              </Button>
              <a
                href={`${api.defaults.baseURL}/admin/report/export`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm">⬇️ Export CSV</Button>
              </a>
            </div>
          </div>

          <AdminTable rows={rows} onDelete={handleDelete} loading={loading} />
        </section>
      </div>
    </div>
  );
}
