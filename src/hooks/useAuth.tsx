/* =====================================================================
   🌐 useAuth hook – JWT (HttpOnly cookie) + profile + role + loading
   =====================================================================*/
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

/* ---------------------------------------------------------------------
   🏷️ Types
   ---------------------------------------------------------------------*/
export type Role = "ADMIN" | "USER";
export interface User {
  email: string;
  role: Role;
}

interface AuthCtx {
  user: User | null;         // โปรไฟล์ (null = ยังไม่รู้ผล)
  loading: boolean;          // true ระหว่างเช็ก /auth/me
  isAuthed: boolean;         // !loading && user !== null
  login:  (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
}

/* ---------------------------------------------------------------------
   📦 Context + Provider
   ---------------------------------------------------------------------*/
const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  /* ---------------- state ---------------- */
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- initial check ---------------- */
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get<User>("/auth/me");
        if (!ignore) setUser(data);
      } catch {
        /* 401 – not authed */
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  /* ---------------- login ---------------- */
  const login = useCallback(async (email: string, password: string, redirect = "/admin/dashboard") => {
    await api.post("/auth/login", { email: email.trim(), password });
    const { data } = await api.get<User>("/auth/me");
    setUser(data);
    navigate(redirect, { replace: true });
  }, []);

  /* ---------------- logout --------------- */
  const logout = useCallback(async (redirect = "/admin/login") => {
    try { await api.post("/auth/logout"); } catch {/* ignore */}
    setUser(null);
    navigate(redirect, { replace: true });
  }, []);

  const isAuthed = !loading && !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ---------------------------------------------------------------------
   🔗 Hook (กับ error guard)
   ---------------------------------------------------------------------*/
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
