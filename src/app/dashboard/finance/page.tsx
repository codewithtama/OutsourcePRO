"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

const MOCK_INVOICES = [
  { id: 1, invoiceNumber: "INV-2026-001", client: "PT Astra Internasional", amount: 450000000, date: "2026-06-01", dueDate: "2026-07-01", status: "Sent" },
  { id: 2, invoiceNumber: "INV-2026-002", client: "PT Telkom Indonesia", amount: 320000000, date: "2026-05-15", dueDate: "2026-06-15", status: "Paid" },
  { id: 3, invoiceNumber: "INV-2026-003", client: "PT GoTo Gojek Tokopedia", amount: 180000000, date: "2026-05-01", dueDate: "2026-05-31", status: "Overdue" },
  { id: 4, invoiceNumber: "INV-2026-004", client: "PT Bukalapak.com", amount: 120000000, date: "2026-06-12", dueDate: "2026-07-12", status: "Draft" },
  { id: 5, invoiceNumber: "INV-2026-005", client: "PT Bank Central Asia", amount: 600000000, date: "2026-06-10", dueDate: "2026-07-10", status: "Sent" },
];

export default function FinancePage() {
  const [invoices] = useState(MOCK_INVOICES);
  const [search, setSearch] = useState("");

  const filtered = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.client.toLowerCase().includes(search.toLowerCase())
  );

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Finance & Billing</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">Track client invoices, payments progress, aging debts, and overall revenue</p>
        </div>
        <div className="flex gap-2">
          <Button className="text-xs">
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Revenue (June 2026)</p>
          <p className="text-3xl font-extrabold text-brand-dark tracking-tight mt-1">{formatIDR(1670000000)}</p>
          <p className="text-xs text-google-green font-bold mt-1.5">&uarr; 8.4% from last month</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Outstanding Receivables</p>
          <p className="text-3xl font-extrabold text-google-yellow tracking-tight mt-1">{formatIDR(1230000000)}</p>
          <p className="text-xs text-brand-muted font-medium mt-1.5">Across 4 sent/unpaid invoices</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Collections Ratio</p>
          <p className="text-3xl font-extrabold text-google-green tracking-tight mt-1">94.2%</p>
          <p className="text-xs text-brand-muted font-medium mt-1.5">Average collection within 30 days</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search client name or invoice..."
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
                {["Invoice Number", "Client", "Amount", "Issued Date", "Due Date", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#fafbfc] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-brand-primary font-bold">{inv.invoiceNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-dark">{inv.client}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-dark">{formatIDR(inv.amount)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-muted font-medium">{inv.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-muted font-medium">{inv.dueDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={inv.status} />
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
