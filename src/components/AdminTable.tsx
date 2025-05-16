// components/AdminTable.tsx
import "../styles/admin-table.css";

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
}

export const AdminTable = <T,>({
  columns,
  data,
  loading,
  keyField,
}: {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  keyField: keyof T;
}) => (
  <div className="admin-table__wrap">
    <table className="admin-table">
    <thead className="bg-muted">
      <tr>
        {columns.map((c) => (
          <th
            key={c.header}
            className={c.hideOnMobile ? "hide-mobile" : "hide-md"}
          >
            {c.header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={columns.length} className="admin-table__state">
            Loading…
          </td>
        </tr>
      ) : data.length === 0 ? (
        <tr>
          <td colSpan={columns.length} className="p-6 text-center">
            No data
          </td>
        </tr>
      ) : (
        data.map((row) => (
          <tr key={String(row[keyField])} className="odd:bg-muted/40">
            {columns.map((c, i) => (
              <td
                key={i}
                className={
                  c.hideOnMobile ? "px-4 py-2 hidden md:table-cell" : "px-4 py-2"
                }
              >
                {c.cell(row)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
  </div>
  
);
export default AdminTable;