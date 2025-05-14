// src/context/AuthContext.tsx
import { createContext, useState, useContext } from "react";

type User = { email: string } | null;
type AuthCtx = {
  user: User;
  login: (email: string, pwd: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  async function login(email: string) {
    /* call API */ setUser({ email });
  }
  function logout() {
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
