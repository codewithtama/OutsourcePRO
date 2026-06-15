"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || data.message || "Invalid credentials");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#fcfdfe] px-4 overflow-hidden">
      {/* Premium ambient light shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-indigo-600 text-white shadow-lg shadow-brand-primary/20 mb-4 hover:scale-105 transition-transform duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-brand-dark tracking-tight">OutsourcePro</h1>
          <p className="text-brand-muted text-sm mt-1.5 font-medium">Enterprise Management Platform</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-brand-border rounded-2xl p-8 shadow-premium">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-brand-dark tracking-tight">Sign In</h2>
            <p className="text-xs text-brand-muted mt-1 font-medium">Enter your enterprise credentials to access dashboard</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200/50 text-rose-700 text-xs font-semibold rounded-lg">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-brand-border text-brand-dark text-sm placeholder-brand-muted/40 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                placeholder="admin@outsourcepro.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-brand-muted uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-brand-border text-brand-dark text-sm placeholder-brand-muted/40 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              id="btn-login"
              type="submit"
              loading={loading}
              className="w-full py-2.5 font-bold"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-brand-muted font-semibold mt-8">
          OutsourcePro ERP &bull; Secure Enterprise Environment
        </p>
      </div>
    </div>
  );
}

