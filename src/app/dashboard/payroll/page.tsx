"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

interface PayrollRecord {
  id: number;
  period: string;
  basic_salary: number;
  allowance: number;
  gross: number;
  total_deductions: number;
  net_salary: number;
  status: string;
  employee: {
    full_name: string;
    position: string | null;
  };
}

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: PayrollRecord[] }>("/payrolls");
      setPayroll(res.data ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const filtered = payroll.filter((p) =>
    (p.employee?.full_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Payroll Processing</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">Generate payslips, process monthly earnings, and verify deductions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs">
            Export Journal
          </Button>
          <Button className="text-xs">
            Run Batch Payroll
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Gross Payout</p>
          <p className="text-3xl font-extrabold text-brand-dark tracking-tight mt-1">
            {loading ? "—" : formatIDR(payroll.reduce((acc, curr) => acc + Number(curr.net_salary), 0))}
          </p>
          <p className="text-xs text-brand-muted font-medium mt-1">Sum of all active batches</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Processed Batches</p>
          <p className="text-3xl font-extrabold text-google-green tracking-tight mt-1">
            {loading ? "—" : `${payroll.filter(p => p.status === "Paid").length} / ${payroll.length} Paid`}
          </p>
          <p className="text-xs text-brand-muted font-medium mt-1">Remaining in Draft/Approval status</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Kasbon / Loans Active</p>
          <p className="text-3xl font-extrabold text-google-yellow tracking-tight mt-1">Rp 0</p>
          <p className="text-xs text-brand-muted font-medium mt-1">Awaiting payroll deductions</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by staff name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-brand-border text-brand-dark text-sm rounded-lg placeholder-brand-muted/60 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all duration-200"
        />
      </div>

      <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-border bg-[#fafbfc]">
                {["Employee Name", "Position", "Basic Salary", "Allowance", "Deductions", "Take-Home Pay", "Status", "Action"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-brand-muted text-sm font-semibold">
                    Calculating salary parameters...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-brand-muted text-sm font-semibold">
                    No payroll files processed.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-brand-dark">{p.employee?.full_name || "Unknown"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-muted font-medium">{p.employee?.position || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-dark font-medium">{formatIDR(p.basic_salary)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-dark font-medium">{formatIDR(p.allowance)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-google-red font-medium">-{formatIDR(p.total_deductions)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-brand-primary">{formatIDR(p.net_salary)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={p.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-xs font-bold text-brand-primary hover:underline transition-all">
                        View Payslip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

