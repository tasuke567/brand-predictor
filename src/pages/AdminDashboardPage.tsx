import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { useAuth } from "@/hooks/useAuth";
import { AdminTable, Column } from "@/components/AdminTable";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { api, DashboardRow } from "@/lib/api";

import "../styles/dashboard-style.css";
dayjs.extend(relativeTime);

/* 🔑 query-keys */
const rowsKey = (f: string, t: string) => ["ADMIN", "rows", f, t] as const;
const brandKey = (f: string, t: string) => ["ADMIN", "brands", f, t] as const;

export default function AdminDashboardPage() {
  /* 🗓 default = 7 ล่าสุด */
  const todayObj = new Date();
  const today = todayObj.toISOString().split("T")[0];
  const lastWeek = new Date(todayObj.getTime() - 6 * 86_400_000)
    .toISOString()
    .split("T")[0];

  const [dateFrom, setDateFrom] = useState(lastWeek);
  const [dateTo, setDateTo] = useState(today);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { logout } = useAuth();
  const navigate = useNavigate();

  /* ── rows ───────────────────────────────────── */
  const {
    data: rows = [],
    isPending: rowsLoading,
    refetch: refetchRows,
  } = useQuery<DashboardRow[]>({
    queryKey: rowsKey(dateFrom, dateTo),
    queryFn: async () => {
      const { data } = await api.get("/admin/questionnaire", {
        params: { from: dateFrom, to: dateTo },
      });
      return data.map((q: any) => ({
        id: q.id,
        brand: q.prediction?.label ?? "-",
        createdAt: q.createdAt,
        user: q.user?.email ?? "-"
      }));
    },
  });

  /* ── chart ──────────────────────────────────── */
  interface BrandStat {
    brand: string;
    total: number;
  }
  const {
    data: brandStats = [],
    isPending: brandLoading,
    refetch: refetchBrand,
  } = useQuery<BrandStat[]>({
    queryKey: brandKey(dateFrom, dateTo),
    queryFn: async () => {
      const { data } = await api.get("/stats/brands", {
        params: { from: dateFrom, to: dateTo },
      });
      return data;
    },
  });

  /* ── table helpers ──────────────────────────── */
  const columns: Column<DashboardRow>[] = [
    { header: "ID", cell: (r) => r.id },
    { header: "Brand", cell: (r) => r.brand },
    {
      header: "Created",
      cell: (r) => new Date(r.createdAt).toLocaleDateString(),
      hideOnMobile: true,
    },
    { header: "User", cell: (r) => r.user ?? "-" },
  ];
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));

  /* ── misc ───────────────────────────────────── */
  const colors = ["#4f46e5", "#f97316", "#10b981", "#ec4899", "#14b8a6"];
  const dateHandler =
    (setter: typeof setDateFrom) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setPage(1);
    };

  const downloadReport = async () => {
    try {
      const { data } = await api.get("/admin/report/export", {
        responseType: "blob",
        params: { from: dateFrom, to: dateTo },
      });
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `brand-report-${dayjs().format("YYYYMMDD-HHmmss")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed ❌");
    }
  };

  /* ── UI ─────────────────────────────────────── */
  return (
    <div className="page-wrapper">
      {/* Topbar */}
      <header className="topbar">
        <h1 className="topbar__title">Admin Dashboard</h1>

        <div className="topbar__actions">
          <Button size="sm" onClick={() => navigate("/admin/models")}>
            ⚙️ จัดการโมเดล
          </Button>
          <Button size="sm" variant="outline" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </header>

      {/* Filter */}
      <Card className="card">
        <CardContent className="card__content filter-form">
          <div className="filter-form__group">
            <label htmlFor="from">จากวันที่</label>
            <input
              id="from"
              type="date"
              value={dateFrom}
              onChange={dateHandler(setDateFrom)}
            />
          </div>
          <div className="filter-form__group">
            <label htmlFor="to">ถึงวันที่</label>
            <input
              id="to"
              type="date"
              value={dateTo}
              onChange={dateHandler(setDateTo)}
            />
          </div>
          <Button
            className="btn btn--outline"
            onClick={() => {
              refetchRows();
              refetchBrand();
            }}
          >
            🔍 Filter
          </Button>
          <Button className="btn btn--outline" onClick={downloadReport}>
            ⬇️ Export CSV
          </Button>
        </CardContent>
      </Card>
      <section className="dashboard-grid">
        {/* Chart */}
        <Card className="card chart-card">
          <CardContent
            className={`card__content chart-card__container${
              brandStats.length ? " is-ready" : ""
            }`}
          >
            {brandLoading ? (
              <p className="text-center text-sm">Loading chart…</p>
            ) : !brandStats.length ? (
              <p className="text-center text-sm text-muted">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandStats}
                    dataKey="total"
                    nameKey="brand"
                    outerRadius="75%"
                    labelLine={false}
                    label={({ payload }) => payload.brand}
                  >
                    {brandStats.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="card">
          <CardContent className="card__content">
            <AdminTable
              data={pagedRows}
              columns={columns}
              keyField="id"
              loading={rowsLoading}
            />
            {pageCount > 1 && (
              <Pagination page={page} pageCount={pageCount} setPage={setPage} />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
