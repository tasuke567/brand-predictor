// ──────────────────────────────────────────────────────────────
// src/hooks/useAuth.tsx
// simple auth context – keeps JWT token, login(), logout()
// token is stored *only* in HttpOnly cookie by backend; here we just
// hit login endpoint and rely on cookie. We still keep a tiny flag in
// sessionStorage so that React routers know we're authenticated.
//----------------------------------------------------------------
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthCtx {
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>(null as any);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem("authed") === "1");

  const login = async (email: string, password: string) => {
    const res = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
      method: "POST",
      credentials: "include", // IMPORTANT – receive HttpOnly cookie
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Invalid credentials");
    sessionStorage.setItem("authed", "1");
    setIsAuthed(true);
    navigate("/admin/dashboard");
  };

  const logout = () => {
    fetch(import.meta.env.VITE_API_URL + "/auth/logout", { credentials: "include" }).catch(() => {});
    sessionStorage.removeItem("authed");
    setIsAuthed(false);
    navigate("/admin/login");
  };

  return <Ctx.Provider value={{ isAuthed, login, logout }}>{children}</Ctx.Provider>;
};
export const useAuth = () => useContext(Ctx);