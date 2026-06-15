"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

const MOCK_PAYROLL = [
  { id: 1, name: "John Doe", position: "Senior Software Engineer", basic: 15000000, allowance: 2500000, deductions: 500000, thp: 17000000, status: "Paid" },
  { id: 2, name: "Jane Smith", position: "HR Specialist", basic: 8500000, allowance: 1200000, deductions: 300000, thp: 9400000, status: "Paid" },
  { id: 3, name: "Michael Johnson", position: "Finance Supervisor", basic: 10000000, allowance: 1800000, deductions: 400000, thp: 11400000, status: "Draft" },
  { id: 4, name: "Sarah Connor", position: "Recruitment Admin", basic: 6000000, allowance: 800000, deductions: 200000, thp: 6600000, status: "Draft" },
  { id: 5, name: "David Miller", position: "Site Coordinator", basic: 7000000, allowance: 900000, deductions: 250000, thp: 7650000, status: "Draft" },
];

export default function PayrollPage() {
  const [payroll] = useState(MOCK_PAYROLL);
  const [search, setSearch] = useState("");

  const filtered = payroll.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
            {formatIDR(payroll.reduce((acc, curr) => acc + curr.thp, 0))}
          </p>
          <p className="text-xs text-brand-muted font-medium mt-1">Sum of all active batches</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Processed Batches</p>
          <p className="text-3xl font-extrabold text-google-green tracking-tight mt-1">2 / 5 Paid</p>
          <p className="text-xs text-brand-muted font-medium mt-1">Remaining in Draft/Approval status</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Kasbon / Loans Active</p>
          <p className="text-3xl font-extrabold text-google-yellow tracking-tight mt-1">Rp 4.5M</p>
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
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#fafbfc] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-dark">{p.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-muted font-medium">{p.position}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-dark font-medium">{formatIDR(p.basic)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-dark font-medium">{formatIDR(p.allowance)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-google-red font-medium">-{formatIDR(p.deductions)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-primary">{formatIDR(p.thp)}</p>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
