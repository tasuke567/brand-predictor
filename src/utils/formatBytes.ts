// utils/formatBytes.ts
export function formatBytes(bytes: number, decimals = 1) {
  if (!bytes) return "0 B";

  const k = 1024;
  const dm = Math.max(decimals, 0);
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  // ดึง log ฐาน 1024 หา index ของหน่วย (0 = B, 1 = KB, …)
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
