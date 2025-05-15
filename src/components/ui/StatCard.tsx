// src/components/StatCard.tsx
type Props = { title: string; value: string | number };

export function StatCard({ title, value }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <span className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
        {value}
      </span>
    </div>
  );
}
