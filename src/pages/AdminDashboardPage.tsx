import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AdminTable, Row } from "@/components/AdminTable";
import { Button } from "@/components/Button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "@/lib/api";

// -----------------------------------------------------------------------------
// 🏷️ Types
// -----------------------------------------------------------------------------
interface BrandStat {
  brand: string;
  total: number;
}

// query keys (tuple literal for strong typing)
const brandKey = ["ADMIN", "brandStats"] as const;
const rowsKey  = ["ADMIN", "rows"] as const;

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const qc = useQueryClient();

  // ---------------------------------------------------------------------------
  // 📊 Brand distribution
  // ---------------------------------------------------------------------------
  const {
    data: brandStats = [],
    isPending: brandLoading,
    error: brandError,
    refetch: refetchBrand,
  } = useQuery<BrandStat[], Error, BrandStat[], typeof brandKey>({
    queryKey: brandKey,
    queryFn: async () => {
      const { data } = await api.get<BrandStat[]>("/stats/brands");
      return data;
    },
    staleTime: 60_000,
    retry: false,
  });

  // ---------------------------------------------------------------------------
  // 📋 Questionnaire list
  // ---------------------------------------------------------------------------
  const {
    data: rows = [],
    isPending: rowsLoading,
    error: rowsError,
    refetch: refetchRows,
  } = useQuery<Row[], Error, Row[], typeof rowsKey>({
    queryKey: rowsKey,
    queryFn: async () => {
      const { data } = await api.get<any[]>("/admin/questionnaire");
      return data.map<Row>((q) => ({
        id: q.id,
        brand: q.prediction?.label ?? "-",
        createdAt: q.createdAt,
        user: q.user?.email ?? "anonymous",
      }));
    },
    staleTime: 30_000,
    retry: false,
  });

  const loading  = brandLoading || rowsLoading;
  const errorMsg = brandError?.message ?? rowsError?.message ?? null;

  // ---------------------------------------------------------------------------
  // 🧮 Derived values
  // ---------------------------------------------------------------------------
  const totalForms = useMemo(() => brandStats.reduce((sum, b) => sum + b.total, 0), [brandStats]);
  const topBrand   = useMemo(() => brandStats.slice().sort((a,b) => b.total - a.total)[0]?.brand ?? "-", [brandStats]);

  // ---------------------------------------------------------------------------
  // 🗑️ Delete helper
  // ---------------------------------------------------------------------------
  const handleDelete = useCallback(async (id: number) => {
    if (!confirm(`Delete questionnaire #${id}?`)) return;
    try {
      await api.delete(`/admin/questionnaire/${id}`);
      qc.invalidateQueries({ queryKey: rowsKey });
    } catch (err: any) {
      alert(err?.response?.data?.error ?? "Delete failed");
    }
  }, [qc]);

  // สีชิ้นพาย (วนลูปตามจำนวนแบรนด์)
  const pieColors = useMemo(() => ["#4f46e5", "#f59e0b", "#10b981", "#ec4899", "#14b8a6"], []);

  // ---------------------------------------------------------------------------
  // 🖼️ UI
  // ---------------------------------------------------------------------------
  return (
    <div className="page-wrapper">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="topbar">
        <h1 className="topbar__title">Admin Dashboard</h1>
        <Button onClick={logout} variant="outline">Logout</Button>
      </header>

      {/* ── Alerts ──────────────────────────────────────────── */}
      {errorMsg && <div className="alert alert--error">⚠️ {errorMsg}</div>}

      {/* ── Stats summary ───────────────────────────────────── */}
      {!loading && (
        <section className="stats-summary" style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <p style={{ margin: ".25rem 0" }}><strong>Total Forms:</strong> {totalForms}</p>
          <p style={{ margin: ".25rem 0" }}><strong>Top Brand:</strong> {topBrand}</p>
        </section>
      )}

      {/* ── Pie chart ──────────────────────────────────────── */}
      {!loading && (
        <section className="card" style={{ height: "18rem" }}>
          <h3>Brand Prediction Share</h3>
          {brandStats.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandStats}
                  dataKey="total"
                  nameKey="brand"
                  outerRadius={110}
                  label={({ brand }) => brand}
                >
                  {brandStats.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted">No data</p>
          )}
        </section>
      )}

      {/* ── Table ───────────────────────────────────────────── */}
      <section className="card">
        <header className="card__header">
          <h2>Questionnaire List</h2>
          <div className="card__actions">
            <Button size="sm" variant="outline" disabled={loading} onClick={() => { refetchBrand(); refetchRows(); }}>
              🔄 Refresh
            </Button>
            <a
              href={`${api.defaults.baseURL}/admin/report/export`}
              className="btn btn--primary btn--sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⬇️ Export CSV
            </a>
          </div>
        </header>

        <AdminTable rows={rows} onDelete={handleDelete} loading={loading} />
      </section>
    </div>
  );
}
