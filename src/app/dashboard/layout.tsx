"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";

function NavIcon({ path }: { path: string }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/"); return; }
    const stored = localStorage.getItem("user");
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";
    try {
      await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "SA";

  const sections = NAV_ITEMS.reduce<{ label: string; items: (typeof NAV_ITEMS)[number][] }[]>((acc, item) => {
    const existing = acc.find((s) => s.label === item.section);
    if (existing) existing.items.push(item);
    else acc.push({ label: item.section, items: [item] });
    return acc;
  }, []);

  return (
    <div className="flex min-h-screen bg-[#fcfdfe] text-brand-dark">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-white border-r border-brand-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-primary/20">
            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-brand-dark font-bold text-sm leading-tight tracking-tight">OutsourcePro</p>
            <p className="text-brand-muted text-xs font-semibold">Enterprise ERP</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-brand-muted uppercase tracking-widest opacity-80">
                {section.label}
              </p>
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? "bg-brand-primary-light text-brand-primary font-bold border-l-2 border-brand-primary rounded-l-none"
                        : "text-brand-muted hover:bg-[#f8f9fa] hover:text-brand-dark"
                    }`}
                  >
                    <NavIcon path={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-border bg-[#fafbfc]">
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brand-dark truncate leading-none mb-1">{user?.name || "Super Admin"}</p>
              <p className="text-xs text-brand-muted truncate font-medium">{user?.email || "admin@outsourcepro.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-google-red bg-rose-50 hover:bg-rose-100/70 border border-rose-100 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 bg-white/70 backdrop-blur-md border-b border-brand-border">
          <button className="lg:hidden text-brand-muted hover:text-brand-dark" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
        </header>

        <main className="flex-1 overflow-auto animate-fade-in">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

