"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

const MOCK_SITES = [
  { id: 1, name: "HQ Jakarta", location: "Sudirman, South Jakarta", headcount: 52, activePlacements: 48, status: "Active", coordinator: "David Miller" },
  { id: 2, name: "Branch Bandung", location: "Asia Afrika, Bandung", headcount: 30, activePlacements: 25, status: "Active", coordinator: "Sarah Connor" },
  { id: 3, name: "Branch Surabaya", location: "Pemuda, Surabaya", headcount: 45, activePlacements: 42, status: "Active", coordinator: "Michael Johnson" },
  { id: 4, name: "Cikarang Warehouse", location: "GIIC, Cikarang", headcount: 80, activePlacements: 75, status: "Active", coordinator: "Rian Hidayat" },
  { id: 5, name: "Karawang Plant", location: "KIM, Karawang", headcount: 120, activePlacements: 110, status: "Active", coordinator: "Budi Santoso" },
];

export default function SitesPage() {
  const [sites] = useState(MOCK_SITES);
  const [search, setSearch] = useState("");

  const filtered = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.coordinator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Site Management</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">Monitor active sites placement & site headcount targets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs">
            Transfer Request
          </Button>
          <Button className="text-xs">
            Add New Site
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Active Sites</p>
            <p className="text-3xl font-extrabold text-brand-dark tracking-tight mt-1">{sites.length}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-primary-light text-brand-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Headcount</p>
            <p className="text-3xl font-extrabold text-brand-dark tracking-tight mt-1">
              {sites.reduce((acc, curr) => acc + curr.headcount, 0)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-google-green">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Active Placements</p>
            <p className="text-3xl font-extrabold text-brand-dark tracking-tight mt-1">
              {sites.reduce((acc, curr) => acc + curr.activePlacements, 0)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search sites, coordinators..."
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
                {["Site Name", "Location", "Active / Target Headcount", "Placement Rate", "Coordinator", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-brand-muted text-sm font-semibold">
                    No active sites found matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((site) => {
                  const rate = Math.round((site.activePlacements / site.headcount) * 100);
                  return (
                    <tr key={site.id} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-brand-dark">{site.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-brand-muted font-medium">{site.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-brand-dark">
                          {site.activePlacements} <span className="text-brand-muted text-xs font-semibold">/ {site.headcount}</span>
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-brand-dark w-10">{rate}%</span>
                          <div className="flex-1 max-w-[100px] bg-[#f1f3f5] rounded-full h-1.5 overflow-hidden">
                            <div className="h-full rounded-full bg-brand-primary" style={{ width: `${rate}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-brand-dark font-medium">{site.coordinator}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={site.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
