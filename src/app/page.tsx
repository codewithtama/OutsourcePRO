"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";
import { User } from "@/lib/types";

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

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
      const data = await api.post<LoginResponse>("/login", { email, password });

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] px-4 font-sans antialiased text-[#202124]">
      <div className="w-full max-w-[450px] bg-white border border-[#dadce0] rounded-lg px-8 py-10 shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.08)]">
        
        {/* Google-like logo block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 justify-center mb-4 select-none">
            {/* Google colored G emblem or custom ERP letter logo */}
            <span className="text-2xl font-bold text-[#4285F4]">O</span>
            <span className="text-2xl font-bold text-[#EA4335]">u</span>
            <span className="text-2xl font-bold text-[#FBBC05]">t</span>
            <span className="text-2xl font-bold text-[#4285F4]">s</span>
            <span className="text-2xl font-bold text-[#34A853]">o</span>
            <span className="text-2xl font-bold text-[#EA4335]">u</span>
            <span className="text-2xl font-bold text-[#4285F4]">r</span>
            <span className="text-2xl font-bold text-[#34A853]">c</span>
            <span className="text-2xl font-bold text-[#FBBC05]">e</span>
            <span className="text-xl font-bold text-[#5f6368] ml-1">Pro</span>
          </div>
          <h1 className="text-2xl font-normal text-[#202124] tracking-tight">Sign in</h1>
          <p className="text-sm text-[#5f6368] mt-2">to continue to OutsourcePro Workspace</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2.5 px-4 py-3 bg-[#fce8e6] border border-[#f8b4b0] text-[#c5221f] text-xs font-medium rounded-lg">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-lg border border-[#dadce0] text-[#202124] text-sm placeholder-transparent focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all peer"
              placeholder="Email"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-3.5 top-[-10px] bg-white px-1 text-xs text-[#5f6368] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-[#5f6368] peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#1a73e8]"
            >
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-lg border border-[#dadce0] text-[#202124] text-sm placeholder-transparent focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all peer"
              placeholder="Password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3.5 top-[-10px] bg-white px-1 text-xs text-[#5f6368] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-[#5f6368] peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#1a73e8]"
            >
              Password
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" className="text-xs font-semibold text-[#1a73e8] hover:text-[#1557b0] transition-colors">
              Forgot email?
            </button>
            <Button
              id="btn-login"
              type="submit"
              loading={loading}
              className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#174ea6] text-white text-xs font-bold rounded-lg transition-all shadow-none"
            >
              Next
            </Button>
          </div>
        </form>
      </div>

      <div className="w-full max-w-[450px] flex items-center justify-between mt-6 px-2 text-xs text-[#5f6368]">
        <span>English (United States)</span>
        <div className="flex gap-4">
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  );
}

