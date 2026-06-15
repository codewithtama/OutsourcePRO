"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

const MOCK_CONTRACTS = [
  { id: 1, name: "John Doe", type: "PKWT", number: "CON/2025/12/009", startDate: "2025-01-10", endDate: "2026-07-10", remainingDays: 25, status: "Active" },
  { id: 2, name: "Jane Smith", type: "PKWTT", number: "CON/2023/03/001", startDate: "2023-03-15", endDate: null, remainingDays: null, status: "Active" },
  { id: 3, name: "Michael Johnson", type: "PKWT", number: "CON/2022/09/012", startDate: "2022-09-01", endDate: "2026-06-22", remainingDays: 7, status: "Expired" },
  { id: 4, name: "Sarah Connor", type: "PKWT", number: "CON/2024/02/003", startDate: "2024-02-18", endDate: "2026-08-18", remainingDays: 64, status: "Active" },
  { id: 5, name: "David Miller", type: "PKWT", number: "CON/2021/06/001", startDate: "2021-06-10", endDate: "2026-06-25", remainingDays: 10, status: "Active" },
];

export default function ContractsPage() {
  const [contracts] = useState(MOCK_CONTRACTS);
  const [filterType, setFilterType] = useState("ALL");

  const filtered = contracts.filter((c) => {
    if (filterType === "ALL") return true;
    return c.type === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Contract Management</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">Monitor employee contracts, alert levels, and status compliance</p>
        </div>
        <div className="flex gap-2">
          <Button className="text-xs">
            Generate Contract Document
          </Button>
        </div>
      </div>

      {/* Warning indicators for expiry levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 border-l-4 border-rose-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Urgent Action (&lt; 14 Days)</p>
            <p className="text-2xl font-extrabold text-brand-dark tracking-tight mt-1">2 Employees</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 rounded-lg">High Risk</span>
        </Card>

        <Card className="p-5 border-l-4 border-amber-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Review Needed (14-30 Days)</p>
            <p className="text-2xl font-extrabold text-brand-dark tracking-tight mt-1">1 Employee</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 rounded-lg">Medium Risk</span>
        </Card>

        <Card className="p-5 border-l-4 border-emerald-50 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Safe (&gt; 30 Days / PKWTT)</p>
            <p className="text-2xl font-extrabold text-brand-dark tracking-tight mt-1">2 Employees</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-lg">Compliant</span>
        </Card>
      </div>

      <div className="flex gap-2">
        {["ALL", "PKWT", "PKWTT"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filterType === type
                ? "bg-brand-primary text-white"
                : "bg-white border border-brand-border text-brand-muted hover:bg-[#fafbfc]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-border bg-[#fafbfc]">
                {["Employee Name", "Contract Type", "Contract Number", "Start Date", "End Date", "Remaining Days", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((contract) => (
                <tr key={contract.id} className="hover:bg-[#fafbfc] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-dark">{contract.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={contract.type} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-brand-primary font-medium">{contract.number}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-muted font-medium">{contract.startDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-muted font-medium">{contract.endDate || "Permanent"}</p>
                  </td>
                  <td className="px-6 py-4">
                    {contract.remainingDays === null ? (
                      <p className="text-sm text-brand-muted font-semibold">—</p>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          contract.remainingDays <= 7 ? "bg-rose-500 animate-pulse" :
                          contract.remainingDays <= 30 ? "bg-amber-500" : "bg-emerald-500"
                        }`} />
                        <p className={`text-sm font-bold ${
                          contract.remainingDays <= 7 ? "text-rose-600" :
                          contract.remainingDays <= 30 ? "text-amber-700" : "text-brand-dark"
                        }`}>
                          {contract.remainingDays} days left
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={contract.status} />
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
