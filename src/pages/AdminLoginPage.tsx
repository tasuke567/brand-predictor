// src/pages/AdminLoginPage.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";

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
      await login(email, pwd); // ← hook จะ redirect เมื่อสำเร็จ
    } catch (e: any) {
      setErr(e.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>

        {err && (
          <div className="rounded bg-rose-100 text-rose-700 px-3 py-2 text-sm">
            {err}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm" htmlFor="em">
            Email
          </label>
          <input
            id="em"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm" htmlFor="pw">
            Password
          </label>
          <input
            id="pw"
            type="password"
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="input-base"
            placeholder="••••••"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in…" : "Login"}
        </Button>

        <div className="text-right text-xs">
          <a href="#" className="hover:underline">
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
}
