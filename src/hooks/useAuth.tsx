// ──────────────────────────────────────────────────────────────
// src/hooks/useAuth.tsx
// จัดการ JWT (เก็บใน HttpOnly cookie) + profile + role
// ──────────────────────────────────────────────────────────────
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

/* ---------- types ---------------------------------------------------------- */
export type User = {
  email: string;
  role: "user" | "ADMIN";
};

interface AuthCtx {
  user: User | null;                 // profile + role   (null = ยังไม่โหลด)
  isAuthed: boolean;                 // true เมื่อ user != null
  login:  (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/* ---------- context -------------------------------------------------------- */
const Ctx = createContext<AuthCtx>(null as never);

/* ---------- provider ------------------------------------------------------- */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const isAuthed        = !!user;

  /* 🔹 ตรวจ cookie ครั้งแรก ถ้า refresh หน้าแล้วเคย login ไว้ */
  useEffect(() => {
    if (sessionStorage.getItem("authed") === "1" && !user) {
      api
        .get<User>("/auth/me")          // backend ใช้ cookie ส่ง profile คืน
        .then(({ data }) => setUser(data))
        .catch(() => sessionStorage.removeItem("authed"));
    }
  }, [user]);

  /* ---------------- login ---------------------------------------------- */
  const login = async (email: string, password: string) => {
    await api.post("/auth/login", { email, password }); // ได้ cookie
    const { data } = await api.get<User>("/auth/me");   // ดึง profile + role

    setUser(data);
    sessionStorage.setItem("authed", "1");
    navigate("/admin/dashboard");
  };

  /* ---------------- logout --------------------------------------------- */
  const logout = async () => {
    try {
      await api.post("/auth/logout");   // ลบ cookie ฝั่ง server
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
    sessionStorage.removeItem("authed");
    navigate("/admin/login");
  };

  /* ---------------- provide -------------------------------------------- */
  return (
    <Ctx.Provider value={{ user, isAuthed, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};

/* ---------- hook ---------------------------------------------------------- */
export const useAuth = () => useContext(Ctx);
