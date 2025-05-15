// src/lib/utils.ts
/**
 * cn() = className helper
 * รวม string/class เงื่อนไข → เหมาะกับ Tailwind
 * ถ้าไม่อยากลง lib เพิ่ม ใช้เวอร์ชันนี้พอ
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/*  ใช้:
   cn("p-4", isDark && "bg-zinc-900", active ? "text-primary" : "text-muted")
*/
