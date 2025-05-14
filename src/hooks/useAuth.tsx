// ──────────────────────────────────────────────────────────────
// src/hooks/useAuth.tsx
// Auth context — จัดการ JWT (cookie ฝั่งเซิร์ฟเวอร์) + profile + role
// ──────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

/* ---------- types ---------------------------------------------------------- */
export type User = {
  email: string;
  role: "user" | "admin";
};

interface AuthCtx {
  user: User | null;                          // ข้อมูลผู้ใช้ (รวม role)
  isAuthed: boolean;                          // true ถ้ามี user
  login:  (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/* ---------- context -------------------------------------------------------- */
const Ctx = createContext<AuthCtx>(null as any);

/* ---------- provider ------------------------------------------------------- */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  /* state: user เก็บ profile เต็ม */
  const [user, setUser] = useState<User | null>(null);
  const isAuthed        = !!user;

  /* ----------------- login ---------------------------------------------- */
  const login = async (email: string, password: string) => {
    // 1) ตี endpoint login → backend set HttpOnly cookie + คืน profile+role
    const { data } = await api.post<{ user: User }>("/auth/login", {
      email,
      password,
    });

    setUser(data.user);
    sessionStorage.setItem("authed", "1");   // เผื่อ refresh หน้า
    navigate("/admin/dashboard");
  };

  /* ----------------- logout --------------------------------------------- */
  const logout = async () => {
    try {
      await api.post("/auth/logout");        // ลบ cookie ฝั่งเซิร์ฟเวอร์
    } catch (err) {
      console.error("Logout failed:", err);
    }
    sessionStorage.removeItem("authed");
    setUser(null);
    navigate("/admin/login");
  };

  /* ----------------- provider value ------------------------------------- */
  return (
    <Ctx.Provider value={{ user, isAuthed, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};

/* ---------- convenient hook ---------------------------------------------- */
export const useAuth = () => useContext(Ctx);
