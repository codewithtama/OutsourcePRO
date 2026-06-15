"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";

function NavIcon({ path }: { path: string }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
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
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 flex flex-col bg-white border-r border-[#dadce0] transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#dadce0]">
          <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-[#202124] font-medium text-sm leading-tight">OutsourcePro</p>
            <p className="text-[#5f6368] text-xs">Enterprise ERP</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-3 pt-3 pb-1 text-xs font-medium text-[#5f6368] uppercase tracking-wider">
                {section.label}
              </p>
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-[#e8f0fe] text-[#1a73e8] font-medium"
                        : "text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]"
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

        <div className="p-4 border-t border-[#dadce0]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#202124] truncate">{user?.name || "Super Admin"}</p>
              <p className="text-xs text-[#5f6368] truncate">{user?.email || "admin@outsourcepro.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center gap-2 px-3 py-2 text-sm text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 bg-white/90 backdrop-blur-sm border-b border-[#dadce0]">
          <button className="lg:hidden text-[#5f6368] hover:text-[#202124]" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
