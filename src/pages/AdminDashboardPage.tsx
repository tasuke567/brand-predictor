// src/pages/AdminDashboardPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { StatCard } from "../components/StatCard";
import { AdminTable, Row } from "../components/AdminTable";
import { Button } from "../components/Button";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface StatResp {
  total: number;
  top3: { brand: string; total: number }[];
  accuracy: number;
}

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<StatResp | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  // ---- fetch on mount ----
  useEffect(() => {
    (async () => {
      const [s, q] = await Promise.all([
        fetch("/api/admin/stats", { credentials: "include" }).then((r) =>
          r.json()
        ),
        fetch("/api/admin/questionnaire", {
          credentials: "include",
        }).then((r) => r.json()),
      ]);
      setStats(s);
      setRows(
        q.map((x: any) => ({
          id: x.id,
          brand: x.prediction?.label,
          createdAt: x.createdAt,
          user: x.user?.email,
        }))
      );
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(`Delete questionnaire #${id}?`)) return;
    await fetch(`/api/admin/questionnaire/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 space-y-8">
      {/* --- top bar --- */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* --- stats --- */}
      {stats && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard title="Total forms" value={stats.total} />
            <StatCard
              title="Accuracy"
              value={`${(stats.accuracy * 100).toFixed(1)}%`}
            />
            <StatCard
              title="Top brand"
              value={stats.top3[0]?.brand || "-"}
            />
          </div>

          {/* ---- Pie top-3 ---- */}
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  dataKey="total"
                  data={stats.top3}
                  nameKey="brand"
                  outerRadius={110}
                  label={({ brand }) => brand}
                >
                  {stats.top3.map((_, i) => (
                    <Cell
                      key={i}
                      fill={["#4f46e5", "#f59e0b", "#10b981"][i]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* --- table + export --- */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Questionnaire list</h2>
        <Button variant="solid" size="sm">
          <a
            href="/api/admin/report/export"
            target="_blank"
            rel="noopener noreferrer"
          >
            Export CSV
          </a>
        </Button>
      </div>

      <AdminTable rows={rows} onDelete={handleDelete} />
    </div>
  );
}
