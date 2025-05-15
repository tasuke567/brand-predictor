import { Button } from "./ui/Button";

/** แถวในตาราง */
export interface Row {
  id: number;
  brand: string;
  createdAt: string;
  user?: string;
}

interface AdminTableProps {
  rows: Row[];
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export function AdminTable({ rows, onDelete, loading }: AdminTableProps) {
  if (loading)
    return (
      <div className="table-state">
        <span className="spinner" />
        <span>กำลังโหลด…</span>
      </div>
    );

  if (!rows.length)
    return <div className="table-state">😶 ยังไม่มีแบบสอบถามในระบบ</div>;

  return (
    <div className="card table-wrapper">
      <table className="datatable">
        <thead>
          <tr>
            <th style={{ width: 60 }}>ID</th>
            <th>Brand</th>
            <th>Created</th>
            <th>User</th>
            <th style={{ width: 70, textAlign: "right" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id} className={idx % 2 ? "row-alt" : undefined}>
              <td>{r.id}</td>
              <td>{r.brand}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td>{r.user ?? "-"}</td>
              <td style={{ textAlign: "right" }}>
                <Button
                  title="ลบรายการนี้"
                  className="btn-icon"
                  onClick={() => onDelete(r.id)}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
