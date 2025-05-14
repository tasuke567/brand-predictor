// src/components/AdminTable.tsx
import { Button } from "./Button";

export interface Row {
  id: number;
  brand: string;
  createdAt: string;
  user?: string;
}
export function AdminTable({
  rows,
  onDelete,
}: {
  rows: Row[];
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {["ID", "Brand", "Created", "User", ""].map((h) => (
              <th
                key={h}
                className="px-4 py-2 font-semibold text-left text-gray-600 dark:text-gray-300 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {rows.map((r) => (
            <tr
              key={r.id}
              className="hover:bg-gray-50/60 dark:hover:bg-gray-700/20"
            >
              <td className="px-4 py-2">{r.id}</td>
              <td className="px-4 py-2">{r.brand}</td>
              <td className="px-4 py-2">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{r.user ?? "-"}</td>
              <td className="px-4 py-2 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(r.id)}
                  title="Delete"
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="p-4 text-center text-sm text-gray-500">No data</p>
      )}
    </div>
  );
}
