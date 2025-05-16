import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { useAuth } from "@/hooks/useAuth";
import { AdminTable, Column } from "@/components/AdminTable";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { api, DashboardRow } from "@/lib/api";

import "../styles/dashboard-style.css";

/* ------------------------------------------------------------------ */
/* 🔑  query-key helpers                                              */
/* ------------------------------------------------------------------ */
const rowsKey = (f: string, t: string) => ["ADMIN", "rows", f, t] as const;
const brandKey = (f: string, t: string) => ["ADMIN", "brands", f, t] as const;

/* ------------------------------------------------------------------ */
/* 📦  Page component                                                 */
/* ------------------------------------------------------------------ */
export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  /* ---------------- 🔍 filter (default = 7 วันล่าสุด) ------------- */
  const todayObj = new Date();
  const today = todayObj.toISOString().split("T")[0];
  const lastWeek = new Date(todayObj.getTime() - 6 * 86_400_000)
    .toISOString()
    .split("T")[0];

  const [dateFrom, setDateFrom] = useState(lastWeek);
  const [dateTo, setDateTo] = useState(today);

  /* ---------------- 📑 pagination --------------------------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------- 📂 rows --------------------------------------- */
  const {
    data: rows = [],
    isPending: rowsLoading,
    refetch: refetchRows,
  } = useQuery<DashboardRow[]>({
    queryKey: rowsKey(dateFrom, dateTo),
    queryFn: async () => {
      const { data } = await api.get<any[]>("/admin/questionnaire", {
        params: { from: dateFrom, to: dateTo },
      });
      return data.map<DashboardRow>((q) => ({
        id: q.id,
        brand: q.prediction?.label ?? "-",
        createdAt: q.createdAt,
        user: q.user,
      }));
    },
    staleTime: 0,
    gcTime: 0,
  });

  /* ---------------- 📊 brand stats (pie chart) -------------------- */
  type BrandStat = { brand: string; total: number };

  const {
    data: brandStats = [],
    isPending: brandLoading,
    refetch: refetchBrand,
  } = useQuery<BrandStat[]>({
    queryKey: brandKey(dateFrom, dateTo),
    queryFn: async () => {
      const { data } = await api.get<BrandStat[]>("/stats/brands", {});
      return data;
    },
    staleTime: 0,
    gcTime: 0,
  });

  /* ---------------- 🧮 columns + paging --------------------------- */
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

  /* ---------------- 🎨 pie chart helpers -------------------------- */
  const colors = ["#4f46e5", "#f97316", "#10b981", "#ec4899", "#14b8a6"];

  /* ---------------- 🔧 handlers ---------------------------------- */
  const handleDate =
    (setter: typeof setDateFrom) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setPage(1);
    };

  /** ⬇️ export CSV */
  const downloadReport = async () => {
    try {
      const { data } = await api.get<Blob>("/admin/report/export", {
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

  /* ---------------- 🖼️  UI --------------------------------------- */
  return (
    <div className="page-wrapper space-y-6">
      {/* ── Topbar ─────────────────────────────────────────── */}
      <header className="topbar flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="min-w-[140px]"
            onClick={() => navigate("/admin/models")}
          >
            ⚙️ จัดการโมเดล
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="min-w-[100px]"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* ── Filters ────────────────────────────────────────── */}
      <Card>
        <CardContent className="filter-form flex gap-3 flex-wrap">
          <div className="flex flex-col">
            <label>จากวันที่</label>
            <input
              type="date"
              value={dateFrom}
              onChange={handleDate(setDateFrom)}
            />
          </div>
          <div className="flex flex-col">
            <label>ถึงวันที่</label>
            <input
              type="date"
              value={dateTo}
              onChange={handleDate(setDateTo)}
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              refetchRows();
              refetchBrand();
            }}
          >
            🔍 Filter
          </Button>
          <Button
            size="sm"
            variant="outline"
            fullWidth
            onClick={downloadReport}
          >
            ⬇️ Export CSV
          </Button>
        </CardContent>
      </Card>

      {/* ── Brand Pie Chart ───────────────────────────────── */}
      <Card>
        <CardContent className="h-72">
          {brandLoading ? (
            <p className="text-center text-sm">Loading chart…</p>
          ) : brandStats.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No data</p>
          ) : (
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
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Table ─────────────────────────────────────────── */}
      <Card>
        <CardContent>
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
    </div>
  );
}
