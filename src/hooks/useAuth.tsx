// ──────────────────────────────────────────────────────────────
// src/hooks/useAuth.tsx
// simple auth context – keeps JWT token, login(), logout()
// token is stored *only* in HttpOnly cookie by backend; here we just
// hit login endpoint and rely on cookie. We still keep a tiny flag in
// sessionStorage so that React routers know we're authenticated.
//----------------------------------------------------------------
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
interface AuthCtx {
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>(null as any);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(
    () => sessionStorage.getItem("authed") === "1"
  );

  const login = async (email: string, password: string) => {
    await api.post("/auth/login", { email, password });
    sessionStorage.setItem("authed", "1");
    setIsAuthed(true);
    navigate("/admin/dashboard");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // ✅ ชัวร์กว่า fetch แบบ manual
    } catch (err) {
      console.error("Logout failed", err);
    }
    sessionStorage.removeItem("authed");
    setIsAuthed(false);
    navigate("/admin/login");
  };

  return (
    <Ctx.Provider value={{ isAuthed, login, logout }}>{children}</Ctx.Provider>
  );
};
export const useAuth = () => useContext(Ctx);
