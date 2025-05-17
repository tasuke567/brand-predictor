// src/pages/AdminLoginPage.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Mail, Lock } from "lucide-react"; // ไอคอนเล็ก ๆ
import "../styles/admin-login.css";
export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, pwd); // ⬅️ redirect ภายใน hook
    } catch (e: any) {
      setErr(e.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <main className="page-login">
      <form onSubmit={submit} className="login-card">
        <h1 className="">Admin Login</h1>

        {err && (
          <p role="alert" className="alert-error">
            ❗ {err}
          </p>
        )}

        {/* email */}
        <label className="block">
          <span className="sr-only">Email</span>
          <div className="field-wrapper">
            <Mail className="input-icon" />
            <input
              autoFocus
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
            />
          </div>
        </label>

        {/* password */}
        <label className="block">
          
          <span className="sr-only">Password</span>
          <div className="field-wrapper">
            <Lock className="input-icon" />
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="input-base"
            />
          </div>
        </label>

        {/* remember me & forgot */}
        <div className="remember-forgot">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-emerald-600 h-4 w-4" />
            <span className="select-none dark:text-slate-300">Remember me</span>
          </label>
          <a
            className="text-emerald-600 hover:underline dark:text-emerald-400"
            href="#"
          >
            Forgot password?
          </a>
        </div>

        {/* submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
