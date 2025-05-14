// src/components/StatCard.tsx
type Props = { title: string; value: string | number };
export function StatCard({ title, value }: Props) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <span className="text-2xl font-semibold text-gray-800 dark:text-gray-50">
        {value}
      </span>
    </div>
  );
}
