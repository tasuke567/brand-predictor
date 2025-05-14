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

/* ---------- Types ---------- */
interface StatResp {
  total: number;
  accuracy: number;          // 0-1
  top3: { brand: string; total: number }[];
}

export default function AdminDashboardPage() {
  /* ---------- state ---------- */
  const { logout }      = useAuth();
  const [stats, setS]   = useState<StatResp | null>(null);
  const [rows,  setR]   = useState<Row[]>([]);
  const [loading, setL] = useState(true);
  const [error,  setE]  = useState<string | null>(null);

  /* ---------- fetch ---------- */
  const load = useCallback(async () => {
    setL(true);
    setE(null);
    try {
      const [{ data: s }, { data: q }] = await Promise.all([
        api.get<StatResp>("/admin/stats/brands"),
        api.get<any[]>("/admin/questionnaire"),
      ]);

      setS(s);
      setR(
        q.map((x) => ({
          id: x.id,
          brand: x.prediction?.label ?? "—",
          createdAt: x.createdAt,
          user: x.user?.email ?? "anonymous",
        }))
      );
    } catch (err: any) {
      setE(err?.response?.data?.error ?? err.message ?? "Load failed");
    } finally {
      setL(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ---------- handlers ---------- */
  const handleDelete = async (id: number) => {
    if (!confirm(`Delete questionnaire #${id}?`)) return;
    try {
      await api.delete(`/admin/questionnaire/${id}`);
      setR((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 space-y-8">
      {/* top bar */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={logout} variant="outline">Logout</Button>
      </header>

      {/* error banner */}
      {error && (
        <div className="rounded bg-rose-100 text-rose-700 px-3 py-2">
          {error}
        </div>
      )}

      {/* stats */}
      {stats ? (
        <>
          <section className="grid sm:grid-cols-3 gap-4">
            <StatCard title="Total forms" value={stats.total} />
            <StatCard
              title="Accuracy"
              value={(stats.accuracy * 100).toFixed(1) + "%"}
            />
            <StatCard title="Top brand" value={stats.top3[0]?.brand ?? "-"} />
          </section>

          {/* pie chart */}
          <section className="w-full h-64">
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
          </section>
        </>
      ) : loading ? (
        <div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-800 rounded" />
      ) : null}

      {/* table + toolbar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questionnaire list</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={load}
              disabled={loading}
            >
              Refresh
            </Button>
            <a
              href={api.defaults.baseURL + "/admin/report/export"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm">Export CSV</Button>
            </a>
          </div>
        </div>

        <AdminTable rows={rows} onDelete={handleDelete} loading={loading} />
      </section>
    </div>
  );
}
