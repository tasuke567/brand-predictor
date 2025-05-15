// src/pages/AdminLoginPage.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Mail, Lock } from "lucide-react";            // ไอคอนเล็ก ๆ

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd]   = useState("");
  const [err, setErr]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, pwd);                       // ⬅️ redirect ภายใน hook
    } catch (e: any) {
      setErr(e.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100/60 via-emerald-100/40 to-emerald-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl shadow-xl border border-gray-200/80 dark:border-slate-700 backdrop-blur-lg bg-white/80 dark:bg-slate-900/70 p-8 space-y-6 animate-fade-in"
      >
        <h1 className="text-2xl font-extrabold text-center tracking-tight dark:text-white">
          Admin Login
        </h1>

        {err && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-rose-50 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200 px-4 py-3 text-sm animate-shake"
          >
            ❗ {err}
          </p>
        )}

        {/* email */}
        <label className="block">
          <span className="sr-only">Email</span>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              autoFocus
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 input-base"
            />
          </div>
        </label>

        {/* password */}
        <label className="block">
          <span className="sr-only">Password</span>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="pl-10 input-base"
            />
          </div>
        </label>

        {/* remember me & forgot */}
        <div className="flex items-center justify-between text-sm">
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

