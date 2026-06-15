"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { KPICard } from "@/components/Card";
import { PaginatedResponse, Employee } from "@/lib/types";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<PaginatedResponse<Employee>>("/employees");
        const employees = res.data ?? [];
        setTotal(res.total ?? employees.length);
        setActive(employees.filter((e: Employee) => e.status === "Active").length);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const kpis = [
    {
      title: "Total Employees",
      value: loading ? "—" : total.toLocaleString(),
      sub: "All registered staff",
      trend: "+12% this month",
      trendUp: true,
      icon: <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      title: "Active Employees",
      value: loading ? "—" : active.toLocaleString(),
      sub: "Currently employed",
      trend: "On track",
      trendUp: true,
      icon: <svg className="w-5 h-5 text-google-green" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      title: "Expiring Contracts",
      value: "45",
      sub: "Within 30 days",
      trend: "Requires attention",
      trendUp: false,
      icon: <svg className="w-5 h-5 text-google-yellow" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    },
    {
      title: "Pending Payroll",
      value: "Rp 2.4B",
      sub: "Due in 3 days",
      trend: "Due soon",
      trendUp: false,
      icon: <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    },
  ];

  const RECENT_ACTIVITY = [
    { color: "bg-brand-primary", title: "New Employee Hired", desc: "Jane Smith joined Human Resources", time: "2h ago" },
    { color: "bg-google-yellow", title: "Contract Expiring", desc: "5 contracts expiring within 30 days", time: "4h ago" },
    { color: "bg-google-green", title: "Payroll Approved", desc: "May 2026 payroll approved by Director", time: "1d ago" },
    { color: "bg-purple-600", title: "New Site Added", desc: "Branch Surabaya assigned 12 employees", time: "2d ago" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Dashboard Overview</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} loading={loading && idx < 2} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl p-6 shadow-premium">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-brand-dark tracking-tight">Headcount by Department</h2>
            <span className="text-xs font-bold text-brand-muted bg-[#f1f3f5] px-2.5 py-1 rounded-lg">June 2026</span>
          </div>
          <div className="space-y-5">
            {[
              { label: "Engineering", value: 40, color: "from-brand-primary to-blue-400" },
              { label: "Human Resources", value: 25, color: "from-purple-600 to-indigo-400" },
              { label: "Finance", value: 20, color: "from-google-green to-emerald-400" },
              { label: "Operations", value: 15, color: "from-google-yellow to-amber-400" },
            ].map((bar) => (
              <div key={bar.label} className="flex items-center gap-4">
                <span className="text-xs font-bold text-brand-muted w-32 shrink-0">{bar.label}</span>
                <div className="flex-1 bg-[#f1f3f5] rounded-full h-2.5 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${bar.color} transition-all duration-1000`} style={{ width: `${bar.value}%` }} />
                </div>
                <span className="text-xs font-bold text-brand-dark w-8 text-right">{bar.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-premium">
          <h2 className="text-base font-bold text-brand-dark tracking-tight mb-5">Recent Activity</h2>
          <ul className="space-y-4">
            {RECENT_ACTIVITY.map((item, idx) => (
              <li key={idx} className="flex gap-3.5 items-start">
                <div className={`w-2 h-2 mt-2 rounded-full ${item.color} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-dark leading-tight">{item.title}</p>
                  <p className="text-xs text-brand-muted font-medium mt-0.5 truncate">{item.desc}</p>
                  <p className="text-[10px] text-brand-muted/70 font-semibold mt-1">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

