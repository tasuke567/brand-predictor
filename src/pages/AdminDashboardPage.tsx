import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AdminTable, Column } from "@/components/AdminTable";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { api, DashboardRow } from "@/lib/api";
import "../styles/dashboard-style.css"; // 👈 ใส่บรรทัดนี้ไว้บนสุด

/* ------------------------------------------------------------------
   query key helper
   ------------------------------------------------------------------*/
const rowsKey = (from: string, to: string) =>
  ["ADMIN", "rows", from, to] as const;

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  /* ---------------- filter state ---------------- */
  const todayObj = new Date();
  const today = todayObj.toISOString().split("T")[0]; // วันนี้
  const lastWeek = new Date(todayObj.getTime() - 6 * 864e5) // 6 วันก่อน
    .toISOString()
    .split("T")[0];

  const [dateFrom, setDateFrom] = useState<string>(lastWeek); // ⬅️ ใช้ 7-day window
  const [dateTo, setDateTo] = useState<string>(today);

  /* ---------------- pagination state ------------ */
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  /* ---------------- rows query ------------------ */
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

  /* ---------------- columns --------------------- */
  const columns: Column<DashboardRow>[] = [
    { header: "ID", cell: (r) => r.id },
    { header: "Brand", cell: (r) => r.brand || "-" },
    {
      header: "Created",
      cell: (r) => new Date(r.createdAt).toLocaleDateString(),
      hideOnMobile: true,
    },
    { header: "User", cell: (r) => r.user ?? "-" },
  ];

  /* ---------------- derived: pagedRows ---------- */
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));

  /* ---------------- helpers --------------------- */
  const onChangeDate = useCallback(
    (setter: typeof setDateFrom) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        setPage(1); // reset page when filter changes
      },
    []
  );

  /* ---------------- UI -------------------------- */
  return (
    <div className="page-wrapper space-y-6">
      {/* Topbar */}
      <header className="topbar flex justify-between items-center">
        <h1 className="topbar__title text-xl font-semibold">Admin Dashboard</h1>
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

      {/* Filters */}
      <Card>
        <CardContent className="filter-form flex gap-3 flex-wrap">
          <div className="flex flex-col">
            <label>จากวันที่</label>
            <input
              type="date"
              value={dateFrom}
              onChange={onChangeDate(setDateFrom)}
            />
          </div>
          <div className="flex flex-col">
            <label>ถึงวันที่</label>
            <input
              type="date"
              value={dateTo}
              onChange={onChangeDate(setDateTo)}
            />
          </div>
          <Button size="sm" variant="outline" onClick={() => refetchRows()}>
            🔍 Filter
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            ⬇️ Export
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="">
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
