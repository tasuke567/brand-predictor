// src/components/AdminTable.tsx
import { Button } from "./Button";

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
      <div className="flex h-40 items-center justify-center">
        <span
          className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
          aria-label="Loading..."
        />
      </div>
    );

  if (!rows.length)
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        😶 ยังไม่มีแบบสอบถามในระบบ
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-4 py-2 text-left font-medium uppercase tracking-wide">ID</th>
            <th className="px-4 py-2 text-left font-medium uppercase tracking-wide">Brand</th>
            <th className="px-4 py-2 text-left font-medium uppercase tracking-wide">Created</th>
            <th className="px-4 py-2 text-left font-medium uppercase tracking-wide">User</th>
            <th className="px-4 py-2 text-right font-medium uppercase tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {rows.map((r) => (
            <tr
              key={r.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{r.id}</td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{r.brand}</td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {r.user ?? "-"}
              </td>
              <td className="px-4 py-2 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(r.id)}
                  title="Delete this entry"
                  className="hover:text-red-600 dark:hover:text-red-400"
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
